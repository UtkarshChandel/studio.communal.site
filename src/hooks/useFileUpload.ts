"use client";

import { useState, useCallback } from "react";
import {
  SSEEvent,
  FileStatus,
  UploadSummary,
  UploadResult,
  validateFiles,
  parseSSEData,
} from "@/lib/knowledge-base";
import { useUploadHistoryStore } from "@/store/useUploadHistoryStore";

export interface FileUploadState {
  isUploading: boolean;
  progress: number; // Overall progress 0-100
  fileStatuses: Record<string, FileStatus>;
  summary: UploadSummary | null;
  results: UploadResult[];
  errors: string[];
}

export interface UseFileUploadReturn {
  state: FileUploadState;
  uploadFiles: (files: File[], sessionId: string) => Promise<void>;
  reset: () => void;
}

const initialState: FileUploadState = {
  isUploading: false,
  progress: 0,
  fileStatuses: {},
  summary: null,
  results: [],
  errors: [],
};

export function useFileUpload(): UseFileUploadReturn {
  const [state, setState] = useState<FileUploadState>(initialState);
  const { addUploadResult, updateFileProgress, updateFileStatus } = useUploadHistoryStore();

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const handleSSEEvent = useCallback((event: SSEEvent) => {
    switch (event.type) {
      case "upload-start":
        setState(prev => ({
          ...prev,
          summary: event.data.overall,
          progress: 0,
        }));
        break;

      case "upload-progress":
        setState(prev => {
          const newFileStatuses = { ...prev.fileStatuses, ...event.data.files };

          // Update history store for each file
          Object.entries(event.data.files).forEach(([fileName, fileStatus]) => {
            updateFileProgress(fileName, fileStatus.progress);
          });

          // Calculate overall progress
          const fileCount = Object.keys(newFileStatuses).length;
          const totalProgress = Object.values(newFileStatuses).reduce(
            (sum, file) => sum + file.progress,
            0
          );
          const overallProgress = fileCount > 0 ? Math.round(totalProgress / fileCount) : 0;

          return {
            ...prev,
            fileStatuses: newFileStatuses,
            progress: overallProgress,
          };
        });
        break;

      case "duplicate-detected":
        setState(prev => {
          // Update history store for duplicate files
          Object.entries(event.data.files).forEach(([fileName, fileStatus]) => {
            addUploadResult(fileName, {
              status: "duplicate",
              progress: 100,
              existingDocumentId: fileStatus.existingDocumentId,
              existingDocumentName: fileStatus.existingDocumentName,
            });
          });

          return {
            ...prev,
            fileStatuses: { ...prev.fileStatuses, ...event.data.files },
          };
        });
        break;

      case "upload-complete":
        setState(prev => {
          const updates: Partial<FileUploadState> = {};

          if (event.data.files) {
            updates.fileStatuses = { ...prev.fileStatuses, ...event.data.files };

            // Update history store for completed files
            Object.entries(event.data.files).forEach(([fileName, fileStatus]) => {
              addUploadResult(fileName, {
                status: fileStatus.status,
                progress: fileStatus.progress,
                documentId: fileStatus.documentId,
                existingDocumentId: fileStatus.existingDocumentId,
              });
            });
          }

          if (event.data.overall) {
            updates.summary = event.data.overall;
            updates.progress = 100;
          }

          if (event.data.results) {
            updates.results = event.data.results;

            // Update history store from results
            event.data.results.forEach(result => {
              if (result.status === "success") {
                updateFileStatus(result.fileName, "completed");
              } else if (result.status === "duplicate") {
                updateFileStatus(result.fileName, "duplicate");
              } else {
                updateFileStatus(result.fileName, "failed");
              }
            });
          }

          return { ...prev, ...updates };
        });
        break;

      case "upload-error":
        setState(prev => {
          const updates: Partial<FileUploadState> = {
            errors: [...prev.errors, event.data.message],
          };

          if (event.data.files) {
            updates.fileStatuses = { ...prev.fileStatuses, ...event.data.files };

            // Update history store for failed files
            Object.entries(event.data.files).forEach(([fileName, fileStatus]) => {
              updateFileStatus(fileName, "failed", fileStatus.error || event.data.message);
            });
          }

          return { ...prev, ...updates };
        });
        break;
    }
  }, [addUploadResult, updateFileProgress, updateFileStatus]);

  const uploadFiles = useCallback(async (files: File[], sessionId: string) => {
    // Keep existing file statuses and only set uploading flag
    setState(prev => ({
      ...prev,
      isUploading: true,
      errors: [], // Clear previous errors
      progress: 0, // Reset overall progress for new batch
    }));

    // Validate files
    const { validFiles, errors } = validateFiles(files);

    if (errors.length > 0) {
      setState(prev => ({
        ...prev,
        errors,
        isUploading: false,
      }));

      if (validFiles.length === 0) {
        return;
      }
    }

    // Create FormData
    const formData = new FormData();
    validFiles.forEach(file => {
      formData.append("files", file);
    });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3200";
      const response = await fetch(`${baseUrl}/api/v1/knowledge-base/upload`, {
        method: "POST",
        headers: {
          "x-session-id": sessionId,
          // No Authorization header needed - using cookie-based auth
        },
        body: formData,
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        // Handle non-SSE error responses
        let errorMessage = `Upload failed (${response.status})`;

        try {
          const errorText = await response.text();
          if (errorText) {
            // Try to parse as JSON first
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.message || errorJson.error || errorMessage;
            } catch {
              // Not JSON, use as plain text
              errorMessage = errorText;
            }
          }
        } catch {
          // Failed to read error text
        }

        setState(prev => ({
          ...prev,
          errors: [...prev.errors, errorMessage],
          isUploading: false,
        }));
        return;
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      // Process SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();

          if (trimmedLine.startsWith("data: ")) {
            const event = parseSSEData(trimmedLine);
            if (event) {
              handleSSEEvent(event);
            }
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim().startsWith("data: ")) {
        const event = parseSSEData(buffer.trim());
        if (event) {
          handleSSEEvent(event);
        }
      }

      setState(prev => ({
        ...prev,
        isUploading: false,
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("File upload error:", error);

      setState(prev => ({
        ...prev,
        errors: [...prev.errors, errorMessage],
        isUploading: false,
      }));
    }
  }, [handleSSEEvent]);

  return {
    state,
    uploadFiles,
    reset,
  };
}