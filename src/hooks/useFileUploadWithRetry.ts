"use client";

import { useState, useCallback, useRef } from "react";
import { useFileUpload } from "./useFileUpload";

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export interface UseFileUploadWithRetryReturn {
  state: ReturnType<typeof useFileUpload>["state"];
  uploadFiles: (files: File[], sessionId: string, options?: RetryOptions) => Promise<void>;
  reset: () => void;
  retryFailedFiles: () => Promise<void>;
  isRetrying: boolean;
}

export function useFileUploadWithRetry(): UseFileUploadWithRetryReturn {
  const { state, uploadFiles: baseUploadFiles, reset } = useFileUpload();
  const [isRetrying, setIsRetrying] = useState(false);
  const failedFilesRef = useRef<{ files: File[]; sessionId: string } | null>(null);

  const uploadWithRetry = useCallback(async (
    files: File[],
    sessionId: string,
    options: RetryOptions = {}
  ) => {
    const { maxRetries = 3, retryDelay = 1000 } = options;
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < maxRetries) {
      try {
        await baseUploadFiles(files, sessionId);

        // Check if there were any errors after upload
        if (state.errors.length > 0) {
          // Store files for potential retry
          failedFilesRef.current = { files, sessionId };

          // If it's a network error or server error, retry
          const hasRetriableError = state.errors.some(error =>
            error.includes("network") ||
            error.includes("Network") ||
            error.includes("500") ||
            error.includes("502") ||
            error.includes("503") ||
            error.includes("504")
          );

          if (hasRetriableError && attempt < maxRetries - 1) {
            attempt++;
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
            reset(); // Clear state before retry
            continue;
          }
        }

        // Success or non-retriable error
        break;

      } catch (error) {
        lastError = error as Error;
        attempt++;

        if (attempt < maxRetries) {
          // Wait before retrying with exponential backoff
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          reset(); // Clear state before retry
        } else {
          // Max retries reached
          failedFilesRef.current = { files, sessionId };
          throw error;
        }
      }
    }

    if (lastError && attempt >= maxRetries) {
      throw lastError;
    }
  }, [baseUploadFiles, state.errors, reset]);

  const retryFailedFiles = useCallback(async () => {
    if (!failedFilesRef.current) {
      return;
    }

    const { files, sessionId } = failedFilesRef.current;
    setIsRetrying(true);

    try {
      await uploadWithRetry(files, sessionId);
      failedFilesRef.current = null;
    } finally {
      setIsRetrying(false);
    }
  }, [uploadWithRetry]);

  return {
    state,
    uploadFiles: uploadWithRetry,
    reset,
    retryFailedFiles,
    isRetrying,
  };
}