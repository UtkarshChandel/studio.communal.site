import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploadModal from '../FileUploadModal';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useUploadHistoryStore } from '@/store/useUploadHistoryStore';

// Mock the hooks
jest.mock('@/hooks/useFileUpload');
jest.mock('@/store/useUploadHistoryStore');

describe('FileUploadModal - Inline Error Messages', () => {
  const mockOnClose = jest.fn();
  const mockOnFileUpload = jest.fn();
  const mockUploadFiles = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the upload history store
    (useUploadHistoryStore as jest.Mock).mockReturnValue({
      uploadHistory: {},
      addUploadResult: jest.fn(),
      updateFileProgress: jest.fn(),
      updateFileStatus: jest.fn(),
      getFileHistory: jest.fn(),
      clearHistory: jest.fn(),
      hasFileHistory: jest.fn(),
    });
  });

  it('should display inline error message for failed file', async () => {
    // Mock upload state with a failed file
    (useFileUpload as jest.Mock).mockReturnValue({
      state: {
        isUploading: false,
        progress: 100,
        fileStatuses: {
          'document.pdf': {
            status: 'failed',
            progress: 0,
            error: 'Network connection failed during upload'
          }
        },
        summary: null,
        results: [],
        errors: []
      },
      uploadFiles: mockUploadFiles,
      reset: mockReset,
    });

    // Mock history with failed file
    (useUploadHistoryStore as jest.Mock).mockReturnValue({
      uploadHistory: {
        'document.pdf': {
          fileName: 'document.pdf',
          status: 'failed',
          progress: 0,
          error: 'Network connection failed during upload',
          timestamp: Date.now()
        }
      },
      getFileHistory: (fileName: string) => {
        if (fileName === 'document.pdf') {
          return {
            fileName: 'document.pdf',
            status: 'failed',
            progress: 0,
            error: 'Network connection failed during upload',
            timestamp: Date.now()
          };
        }
        return undefined;
      },
      addUploadResult: jest.fn(),
      updateFileProgress: jest.fn(),
      updateFileStatus: jest.fn(),
      clearHistory: jest.fn(),
      hasFileHistory: jest.fn(),
    });

    render(
      <FileUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onFileUpload={mockOnFileUpload}
        sessionId="test-session"
      />
    );

    // Wait for the error message to appear
    await waitFor(() => {
      const errorMessage = screen.queryByText('Network connection failed during upload');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should display inline duplicate warning for duplicate file', async () => {
    // Mock upload state with a duplicate file
    (useFileUpload as jest.Mock).mockReturnValue({
      state: {
        isUploading: false,
        progress: 100,
        fileStatuses: {
          'existing-doc.pdf': {
            status: 'duplicate',
            progress: 100,
            existingDocumentId: 'doc-123',
            existingDocumentName: 'Company Policy Document v2.pdf'
          }
        },
        summary: null,
        results: [],
        errors: []
      },
      uploadFiles: mockUploadFiles,
      reset: mockReset,
    });

    // Mock history with duplicate file
    (useUploadHistoryStore as jest.Mock).mockReturnValue({
      uploadHistory: {
        'existing-doc.pdf': {
          fileName: 'existing-doc.pdf',
          status: 'duplicate',
          progress: 100,
          existingDocumentId: 'doc-123',
          existingDocumentName: 'Company Policy Document v2.pdf',
          timestamp: Date.now()
        }
      },
      getFileHistory: (fileName: string) => {
        if (fileName === 'existing-doc.pdf') {
          return {
            fileName: 'existing-doc.pdf',
            status: 'duplicate',
            progress: 100,
            existingDocumentId: 'doc-123',
            existingDocumentName: 'Company Policy Document v2.pdf',
            timestamp: Date.now()
          };
        }
        return undefined;
      },
      addUploadResult: jest.fn(),
      updateFileProgress: jest.fn(),
      updateFileStatus: jest.fn(),
      clearHistory: jest.fn(),
      hasFileHistory: jest.fn(),
    });

    render(
      <FileUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onFileUpload={mockOnFileUpload}
        sessionId="test-session"
      />
    );

    // Wait for the duplicate warning to appear
    await waitFor(() => {
      const duplicateMessage = screen.queryByText('Already uploaded as "Company Policy Document v2.pdf"');
      expect(duplicateMessage).toBeInTheDocument();
    });
  });

  it('should apply appropriate background colors for different file statuses', async () => {
    // Mock upload state with multiple files
    (useFileUpload as jest.Mock).mockReturnValue({
      state: {
        isUploading: false,
        progress: 100,
        fileStatuses: {
          'success.pdf': {
            status: 'completed',
            progress: 100
          },
          'duplicate.pdf': {
            status: 'duplicate',
            progress: 100,
            existingDocumentId: 'doc-456'
          },
          'failed.pdf': {
            status: 'failed',
            progress: 0,
            error: 'File too large'
          }
        },
        summary: null,
        results: [],
        errors: []
      },
      uploadFiles: mockUploadFiles,
      reset: mockReset,
    });

    const { container } = render(
      <FileUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onFileUpload={mockOnFileUpload}
        sessionId="test-session"
      />
    );

    // Check for background color classes
    await waitFor(() => {
      // Yellow background for duplicate
      const yellowBg = container.querySelector('.bg-yellow-50.border-yellow-300');
      expect(yellowBg).toBeInTheDocument();

      // Red background for failed
      const redBg = container.querySelector('.bg-red-50.border-red-300');
      expect(redBg).toBeInTheDocument();

      // White background for successful
      const whiteBg = container.querySelector('.bg-white.border-\\[\\#5350ec\\]');
      expect(whiteBg).toBeInTheDocument();
    });
  });

  it('should not display generic error notifications', async () => {
    // Mock upload state with errors
    (useFileUpload as jest.Mock).mockReturnValue({
      state: {
        isUploading: false,
        progress: 100,
        fileStatuses: {
          'test.pdf': {
            status: 'failed',
            progress: 0,
            error: 'Upload failed'
          }
        },
        summary: null,
        results: [],
        errors: ['Some files were already uploaded and will be skipped']
      },
      uploadFiles: mockUploadFiles,
      reset: mockReset,
    });

    render(
      <FileUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onFileUpload={mockOnFileUpload}
        sessionId="test-session"
      />
    );

    // Generic error message should NOT appear
    await waitFor(() => {
      const genericError = screen.queryByText('Some files were already uploaded and will be skipped');
      expect(genericError).not.toBeInTheDocument();
    });
  });
});