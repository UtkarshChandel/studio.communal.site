import { create } from "zustand";
import { FileUploadStatus } from "@/lib/knowledge-base";

export interface FileUploadHistory {
  fileName: string;
  status: FileUploadStatus;
  progress: number;
  error?: string;
  documentId?: string;
  existingDocumentId?: string;
  existingDocumentName?: string;
  timestamp: number;
  metadataAdded?: boolean; // Track if metadata has been added
}

interface UploadHistoryStore {
  uploadHistory: Record<string, FileUploadHistory>;
  taggedDocuments: Set<string>; // Track files that have been tagged
  addUploadResult: (fileName: string, result: Omit<FileUploadHistory, "fileName" | "timestamp">) => void;
  updateFileProgress: (fileName: string, progress: number) => void;
  updateFileStatus: (fileName: string, status: FileUploadStatus, error?: string) => void;
  getFileHistory: (fileName: string) => FileUploadHistory | undefined;
  clearHistory: () => void;
  hasFileHistory: (fileName: string) => boolean;
  addTaggedDocument: (fileName: string) => void;
  isDocumentTagged: (fileName: string) => boolean;
  getUntaggedFiles: () => FileUploadHistory[];
  removeFromHistory: (fileName: string) => void;
}

export const useUploadHistoryStore = create<UploadHistoryStore>((set, get) => ({
  uploadHistory: {},
  taggedDocuments: new Set(),

  addUploadResult: (fileName, result) => {
    set((state) => ({
      uploadHistory: {
        ...state.uploadHistory,
        [fileName]: {
          fileName,
          ...result,
          timestamp: Date.now(),
        },
      },
    }));
  },

  updateFileProgress: (fileName, progress) => {
    set((state) => {
      const existing = state.uploadHistory[fileName];
      if (!existing) {
        // Create new entry if doesn't exist
        return {
          uploadHistory: {
            ...state.uploadHistory,
            [fileName]: {
              fileName,
              status: "uploading",
              progress,
              timestamp: Date.now(),
            },
          },
        };
      }

      return {
        uploadHistory: {
          ...state.uploadHistory,
          [fileName]: {
            ...existing,
            progress,
          },
        },
      };
    });
  },

  updateFileStatus: (fileName, status, error) => {
    set((state) => {
      const existing = state.uploadHistory[fileName];
      if (!existing) {
        // Create new entry if doesn't exist
        return {
          uploadHistory: {
            ...state.uploadHistory,
            [fileName]: {
              fileName,
              status,
              progress: status === "completed" ? 100 : 0,
              error,
              timestamp: Date.now(),
            },
          },
        };
      }

      return {
        uploadHistory: {
          ...state.uploadHistory,
          [fileName]: {
            ...existing,
            status,
            error: error || existing.error,
            progress: status === "completed" ? 100 : existing.progress,
          },
        },
      };
    });
  },

  getFileHistory: (fileName) => {
    return get().uploadHistory[fileName];
  },

  hasFileHistory: (fileName) => {
    return fileName in get().uploadHistory;
  },

  clearHistory: () => {
    set({ uploadHistory: {}, taggedDocuments: new Set() });
  },

  addTaggedDocument: (fileName) => {
    set((state) => ({
      taggedDocuments: new Set(state.taggedDocuments).add(fileName),
      uploadHistory: {
        ...state.uploadHistory,
        [fileName]: {
          ...state.uploadHistory[fileName],
          metadataAdded: true,
        },
      },
    }));
  },

  isDocumentTagged: (fileName) => {
    return get().taggedDocuments.has(fileName);
  },

  getUntaggedFiles: () => {
    const state = get();
    return Object.values(state.uploadHistory).filter(
      (file) =>
        file.status === "completed" &&
        !state.taggedDocuments.has(file.fileName)
    );
  },

  removeFromHistory: (fileName) => {
    set((state) => {
      const { [fileName]: removed, ...rest } = state.uploadHistory;
      const newTaggedDocs = new Set(state.taggedDocuments);
      newTaggedDocs.delete(fileName);
      return {
        uploadHistory: rest,
        taggedDocuments: newTaggedDocs,
      };
    });
  },
}));