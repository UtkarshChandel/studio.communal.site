import { updateDocumentMetadata, batchUpdateDocumentMetadata } from '../knowledge-base-api';
import { DocumentMetadataUpdate } from '../knowledge-base';

// Mock fetch
global.fetch = jest.fn();

describe('Knowledge Base API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('updateDocumentMetadata', () => {
    it('should successfully update document metadata', async () => {
      const mockResponse = {
        message: 'Document metadata updated',
        data: {
          documentId: 'doc_123',
          documentName: 'test.pdf',
          description: 'Test description',
          tags: ['tag1', 'tag2'],
          status: 'READY_TO_INGEST',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const metadata: DocumentMetadataUpdate = {
        description: 'Test description',
        tags: ['tag1', 'tag2'],
      };

      const result = await updateDocumentMetadata('doc_123', metadata, 'session_456');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/knowledge-base/documents/doc_123'),
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-session-id': 'session_456',
          }),
          credentials: 'include',
          body: JSON.stringify(metadata),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle 404 error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          statusCode: 404,
          message: 'Document not found',
          error: 'Not Found',
        }),
      });

      const metadata: DocumentMetadataUpdate = {
        description: 'Test description',
      };

      await expect(
        updateDocumentMetadata('doc_999', metadata, 'session_456')
      ).rejects.toThrow('Document not found');
    });

    it('should handle validation errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          statusCode: 400,
          message: ['description must be shorter than or equal to 1000 characters'],
          error: 'Bad Request',
        }),
      });

      const metadata: DocumentMetadataUpdate = {
        description: 'a'.repeat(1001), // Too long
      };

      await expect(
        updateDocumentMetadata('doc_123', metadata, 'session_456')
      ).rejects.toThrow('description must be shorter than or equal to 1000 characters');
    });
  });

  describe('batchUpdateDocumentMetadata', () => {
    it('should successfully update multiple documents', async () => {
      const mockResponse1 = {
        message: 'Document metadata updated',
        data: {
          documentId: 'doc_123',
          documentName: 'test1.pdf',
          description: 'Test 1',
          tags: ['tag1'],
          status: 'READY_TO_INGEST',
        },
      };

      const mockResponse2 = {
        message: 'Document metadata updated',
        data: {
          documentId: 'doc_456',
          documentName: 'test2.pdf',
          description: 'Test 2',
          tags: ['tag2'],
          status: 'READY_TO_INGEST',
        },
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse2,
        });

      const updates = [
        {
          documentId: 'doc_123',
          fileName: 'test1.pdf',
          metadata: { description: 'Test 1', tags: ['tag1'] },
        },
        {
          documentId: 'doc_456',
          fileName: 'test2.pdf',
          metadata: { description: 'Test 2', tags: ['tag2'] },
        },
      ];

      const results = await batchUpdateDocumentMetadata(updates, 'session_456');

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({
        documentId: 'doc_123',
        fileName: 'test1.pdf',
        success: true,
        response: mockResponse1,
      });
      expect(results[1]).toEqual({
        documentId: 'doc_456',
        fileName: 'test2.pdf',
        success: true,
        response: mockResponse2,
      });
    });

    it('should handle partial failures', async () => {
      const mockResponse1 = {
        message: 'Document metadata updated',
        data: {
          documentId: 'doc_123',
          documentName: 'test1.pdf',
          description: 'Test 1',
          tags: ['tag1'],
          status: 'READY_TO_INGEST',
        },
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse1,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({
            message: 'Document not found',
          }),
        });

      const updates = [
        {
          documentId: 'doc_123',
          fileName: 'test1.pdf',
          metadata: { description: 'Test 1', tags: ['tag1'] },
        },
        {
          documentId: 'doc_999',
          fileName: 'test2.pdf',
          metadata: { description: 'Test 2', tags: ['tag2'] },
        },
      ];

      const results = await batchUpdateDocumentMetadata(updates, 'session_456');

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toContain('Document not found');
    });
  });
});