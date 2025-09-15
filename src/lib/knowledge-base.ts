// Knowledge Base API types and utilities

// File upload status types
export type FileUploadStatus = "uploading" | "completed" | "failed" | "duplicate";

// Event types for SSE
export type SSEEventType =
  | "upload-start"
  | "upload-progress"
  | "upload-complete"
  | "duplicate-detected"
  | "upload-error";

// Individual file status in SSE events
export interface FileStatus {
  progress: number;
  status: FileUploadStatus;
  documentId?: string;
  existingDocumentId?: string;
  existingDocumentName?: string;
  error?: string;
}

// Overall upload summary
export interface UploadSummary {
  totalFiles: number;
  completed: number;
  failed: number;
  duplicates: number;
}

// Upload result for individual files
export interface UploadResult {
  fileName: string;
  documentId?: string;
  status: "success" | "duplicate" | "failed";
  existingDocumentId?: string;
}

// SSE Event data structures
export interface UploadStartEvent {
  type: "upload-start";
  data: {
    overall: UploadSummary;
  };
}

export interface UploadProgressEvent {
  type: "upload-progress";
  data: {
    files: Record<string, FileStatus>;
  };
}

export interface UploadCompleteEvent {
  type: "upload-complete";
  data: {
    files?: Record<string, FileStatus>;
    overall?: UploadSummary;
    results?: UploadResult[];
    message?: string;
  };
}

export interface DuplicateDetectedEvent {
  type: "duplicate-detected";
  data: {
    files: Record<string, FileStatus>;
  };
}

export interface UploadErrorEvent {
  type: "upload-error";
  data: {
    files?: Record<string, FileStatus>;
    message: string;
    error: string;
  };
}

export type SSEEvent =
  | UploadStartEvent
  | UploadProgressEvent
  | UploadCompleteEvent
  | DuplicateDetectedEvent
  | UploadErrorEvent;

// File validation constraints
export const FILE_UPLOAD_CONSTRAINTS = {
  MAX_FILES: 10,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB in bytes
  ALLOWED_TYPES: ["application/pdf", "text/plain"],
  ALLOWED_EXTENSIONS: [".pdf", ".txt"],
};

// Validate a file before upload
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > FILE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds 50MB limit`
    };
  }

  // Check file type
  const hasValidType = FILE_UPLOAD_CONSTRAINTS.ALLOWED_TYPES.includes(file.type);
  const hasValidExtension = FILE_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.some(
    ext => file.name.toLowerCase().endsWith(ext)
  );

  if (!hasValidType && !hasValidExtension) {
    return {
      valid: false,
      error: `File "${file.name}" must be PDF or TXT format`
    };
  }

  return { valid: true };
}

// Validate multiple files
export function validateFiles(files: File[]): {
  validFiles: File[];
  errors: string[];
} {
  const validFiles: File[] = [];
  const errors: string[] = [];

  // Check total file count
  if (files.length > FILE_UPLOAD_CONSTRAINTS.MAX_FILES) {
    errors.push(`Maximum ${FILE_UPLOAD_CONSTRAINTS.MAX_FILES} files allowed per upload`);
    // Still process the first 10 files
    files = files.slice(0, FILE_UPLOAD_CONSTRAINTS.MAX_FILES);
  }

  // Validate each file
  for (const file of files) {
    const validation = validateFile(file);
    if (validation.valid) {
      validFiles.push(file);
    } else if (validation.error) {
      errors.push(validation.error);
    }
  }

  return { validFiles, errors };
}

// Parse SSE data from event stream
export function parseSSEData(data: string): SSEEvent | null {
  try {
    // SSE data comes as "data: {json}"
    if (data.startsWith("data: ")) {
      const jsonStr = data.substring(6).trim();
      if (jsonStr) {
        return JSON.parse(jsonStr) as SSEEvent;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to parse SSE data:", error, "Raw data:", data);
    return null;
  }
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

// Document metadata update types
export interface DocumentMetadataUpdate {
  description?: string;
  tags?: string[];
}

export interface DocumentMetadataResponse {
  message: string;
  data: {
    documentId: string;
    documentName: string;
    description?: string;
    tags?: string[];
    status: "READY_TO_INGEST" | string;
  };
}

// Document ingest types
export interface IngestRequest {
  sessionId: string;
  documentIds: string[];
}

export interface IngestResponse {
  message: string;
  status: "started" | "queued" | "failed";
  documentIds: string[];
}