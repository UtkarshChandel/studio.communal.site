// API functions for knowledge base operations

import {
  DocumentMetadataUpdate,
  DocumentMetadataResponse,
  IngestRequest,
  IngestResponse,
} from "./knowledge-base";

/**
 * Update document metadata (description and tags)
 * @param documentId - The document ID from upload response
 * @param metadata - The metadata to update (description and/or tags)
 * @param sessionId - The session ID for the request
 * @returns Promise with the updated document data
 */
export async function updateDocumentMetadata(
  documentId: string,
  metadata: DocumentMetadataUpdate,
  sessionId: string
): Promise<DocumentMetadataResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3200";
  const url = `${baseUrl}/api/v1/knowledge-base/documents/${documentId}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-session-id": sessionId,
      // No Authorization header - using cookie-based auth
    },
    credentials: "include", // Include cookies for authentication
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    let errorMessage = `Failed to update document metadata (${response.status})`;

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message;
      }
    } catch {
      // If parsing JSON fails, try to get text
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch {
        // Use default error message
      }
    }

    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result;
}

/**
 * Batch update metadata for multiple documents
 * @param updates - Array of document updates with IDs and metadata
 * @param sessionId - The session ID for the request
 * @returns Promise with results for each document (success or error)
 */
export async function batchUpdateDocumentMetadata(
  updates: Array<{
    documentId: string;
    fileName: string;
    metadata: DocumentMetadataUpdate;
  }>,
  sessionId: string
): Promise<Array<{
  documentId: string;
  fileName: string;
  success: boolean;
  error?: string;
  response?: DocumentMetadataResponse;
}>> {
  const results = await Promise.allSettled(
    updates.map(async (update) => {
      try {
        const response = await updateDocumentMetadata(
          update.documentId,
          update.metadata,
          sessionId
        );
        return {
          documentId: update.documentId,
          fileName: update.fileName,
          success: true,
          response,
        };
      } catch (error) {
        return {
          documentId: update.documentId,
          fileName: update.fileName,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    })
  );

  return results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        documentId: "",
        fileName: "",
        success: false,
        error: result.reason?.message || "Unknown error",
      };
    }
  });
}

/**
 * Trigger document ingestion for uploaded and tagged documents
 * @param documentIds - Array of document IDs to ingest
 * @param sessionId - The session ID for the request
 * @returns Promise with the ingestion response
 */
export async function ingestDocuments(
  documentIds: string[],
  sessionId: string
): Promise<IngestResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3200";
  const url = `${baseUrl}/api/v1/knowledge-base/ingest`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-session-id": sessionId,
      // No Authorization header - using cookie-based auth
    },
    credentials: "include", // Include cookies for authentication
    body: JSON.stringify({
      sessionId,
      documentIds,
    } as IngestRequest),
  });

  if (!response.ok) {
    let errorMessage = `Failed to trigger document ingestion (${response.status})`;

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message;
      }
    } catch {
      // If parsing JSON fails, try to get text
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch {
        // Use default error message
      }
    }

    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result;
}