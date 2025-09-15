"use client";

import { useState, useCallback } from "react";
import { DocumentMetadataUpdate } from "@/lib/knowledge-base";
import { batchUpdateDocumentMetadata } from "@/lib/knowledge-base-api";

export interface DocumentMetadataState {
  isUpdating: boolean;
  progress: number; // 0-100 percentage of documents updated
  results: Array<{
    documentId: string;
    fileName: string;
    success: boolean;
    error?: string;
  }>;
  errors: string[];
}

export interface UseDocumentMetadataReturn {
  state: DocumentMetadataState;
  updateDocumentsMetadata: (
    documents: Array<{
      documentId: string;
      fileName: string;
      description?: string;
      tags?: string[];
    }>,
    sessionId: string
  ) => Promise<void>;
  reset: () => void;
}

const initialState: DocumentMetadataState = {
  isUpdating: false,
  progress: 0,
  results: [],
  errors: [],
};

export function useDocumentMetadata(): UseDocumentMetadataReturn {
  const [state, setState] = useState<DocumentMetadataState>(initialState);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const updateDocumentsMetadata = useCallback(
    async (
      documents: Array<{
        documentId: string;
        fileName: string;
        description?: string;
        tags?: string[];
      }>,
      sessionId: string
    ) => {
      // Reset state and start updating
      setState({
        isUpdating: true,
        progress: 0,
        results: [],
        errors: [],
      });

      try {
        // Prepare updates - only include documents with metadata
        const updates = documents
          .filter((doc) => doc.description || (doc.tags && doc.tags.length > 0))
          .map((doc) => ({
            documentId: doc.documentId,
            fileName: doc.fileName,
            metadata: {
              description: doc.description,
              tags: doc.tags,
            } as DocumentMetadataUpdate,
          }));

        if (updates.length === 0) {
          // No metadata to update
          setState({
            isUpdating: false,
            progress: 100,
            results: [],
            errors: [],
          });
          return;
        }

        // Track progress
        let completed = 0;
        const total = updates.length;

        // Process in batches to show progress
        const batchSize = 3; // Process 3 at a time
        const allResults: typeof state.results = [];

        for (let i = 0; i < updates.length; i += batchSize) {
          const batch = updates.slice(i, i + batchSize);

          // Update metadata for this batch
          const batchResults = await batchUpdateDocumentMetadata(batch, sessionId);

          // Process results
          batchResults.forEach((result) => {
            allResults.push({
              documentId: result.documentId,
              fileName: result.fileName,
              success: result.success,
              error: result.error,
            });

            if (!result.success && result.error) {
              setState((prev) => ({
                ...prev,
                errors: [...prev.errors, `${result.fileName}: ${result.error}`],
              }));
            }
          });

          // Update progress
          completed += batch.length;
          const progress = Math.round((completed / total) * 100);

          setState((prev) => ({
            ...prev,
            progress,
            results: [...allResults],
          }));
        }

        // Final state update
        setState((prev) => ({
          ...prev,
          isUpdating: false,
          progress: 100,
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Document metadata update error:", error);

        setState((prev) => ({
          ...prev,
          errors: [...prev.errors, errorMessage],
          isUpdating: false,
        }));
      }
    },
    []
  );

  return {
    state,
    updateDocumentsMetadata,
    reset,
  };
}