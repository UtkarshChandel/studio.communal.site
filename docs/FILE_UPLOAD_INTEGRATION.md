# Knowledge Base File Upload Integration

## Overview

This document describes the file upload integration with the Knowledge Base SSE API. The implementation provides real-time upload progress through Server-Sent Events (SSE), handles duplicates, and provides comprehensive error handling.

## Architecture

### Components

1. **FileUploadModal** (`/src/components/ui/FileUploadModal.tsx`)
   - Main UI component for file selection and upload
   - Displays real-time progress for each file
   - Shows inline duplicate notifications and errors per file
   - Supports drag-and-drop and click-to-upload
   - Preserves upload status across multiple upload batches in the same session

2. **ChatWindow** (`/src/components/ui/ChatWindow.tsx`)
   - Integrates the file upload modal
   - Passes session ID to the upload modal
   - Handles file upload button click

3. **useFileUpload Hook** (`/src/hooks/useFileUpload.ts`)
   - React hook for managing upload state
   - Processes SSE events from the backend
   - Tracks individual file progress
   - Handles errors and duplicates
   - Preserves existing file statuses when starting new uploads

4. **useUploadHistoryStore** (`/src/store/useUploadHistoryStore.ts`)
   - Zustand store for session-scoped file upload history
   - Tracks status, progress, and errors for all uploaded files
   - Enables status persistence across multiple upload batches

5. **useFileUploadWithRetry Hook** (`/src/hooks/useFileUploadWithRetry.ts`)
   - Extends useFileUpload with retry logic
   - Implements exponential backoff
   - Handles network interruptions

6. **Knowledge Base Utilities** (`/src/lib/knowledge-base.ts`)
   - TypeScript types for SSE events
   - File validation utilities
   - Helper functions

## API Integration

### Upload Endpoint
- **URL**: `POST /api/v1/knowledge-base/upload`
- **Authentication**: Cookie-based (httpOnly JWT)
- **Headers**:
  - `x-session-id`: Current session ID
  - `Content-Type`: multipart/form-data

### Metadata Update Endpoint
- **URL**: `PATCH /api/v1/knowledge-base/documents/{documentId}`
- **Authentication**: Cookie-based (httpOnly JWT)
- **Headers**:
  - `x-session-id`: Current session ID
  - `Content-Type`: application/json
- **Body**:
  ```json
  {
    "description": "Optional description (max 1000 chars)",
    "tags": ["optional", "array", "of", "tags"]
  }
  ``` (auto-set)

### File Constraints
- **Max Files**: 10 per upload
- **Max Size**: 50MB per file
- **Allowed Types**: PDF (`application/pdf`), TXT (`text/plain`)

### SSE Events

The backend sends the following event types:

1. **upload-start**: Initial event with overall summary
2. **upload-progress**: Per-file progress updates (0-100%)
3. **upload-complete**: Individual file completion or final summary
4. **duplicate-detected**: When a file already exists
5. **upload-error**: Error notifications

## Workflow

### Complete Upload & Metadata Flow
1. **Upload Files**: User selects and uploads files
2. **Real-time Progress**: SSE events provide progress updates
3. **Upload Complete**: System shows results (success/duplicate/failed)
4. **Add Metadata**: User clicks "Next" to add descriptions and tags
5. **Submit Metadata**: System sends PATCH requests for each successful file
6. **Complete**: Modal closes after metadata is saved

## Usage

### Basic Implementation

```tsx
import ChatWindow from '@/components/ui/ChatWindow';

function StudioPage() {
  const sessionId = 'your-session-id';

  return (
    <ChatWindow
      sessionId={sessionId}
      // ... other props
    />
  );
}
```

### Direct Modal Usage

```tsx
import FileUploadModal from '@/components/ui/FileUploadModal';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const sessionId = 'your-session-id';

  const handleFileUpload = (files: File[]) => {
    console.log('Files uploaded:', files);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Upload Files
      </button>

      <FileUploadModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onFileUpload={handleFileUpload}
        sessionId={sessionId}
      />
    </>
  );
}
```

### Using the Hook Directly

```tsx
import { useFileUpload } from '@/hooks/useFileUpload';

function MyUploadComponent() {
  const { state, uploadFiles, reset } = useFileUpload();
  const sessionId = 'your-session-id';

  const handleUpload = async (files: File[]) => {
    await uploadFiles(files, sessionId);

    // Check results
    if (state.errors.length > 0) {
      console.error('Upload errors:', state.errors);
    }

    // Check for duplicates
    const duplicates = Object.entries(state.fileStatuses)
      .filter(([_, status]) => status.status === 'duplicate');

    if (duplicates.length > 0) {
      console.log('Duplicate files:', duplicates);
    }
  };

  return (
    <div>
      <div>Upload Progress: {state.progress}%</div>
      <div>Uploading: {state.isUploading ? 'Yes' : 'No'}</div>
      {/* File input UI */}
    </div>
  );
}
```

### With Retry Logic

```tsx
import { useFileUploadWithRetry } from '@/hooks/useFileUploadWithRetry';

function RobustUploadComponent() {
  const { state, uploadFiles, retryFailedFiles, isRetrying } = useFileUploadWithRetry();

  const handleUpload = async (files: File[]) => {
    await uploadFiles(files, sessionId, {
      maxRetries: 3,
      retryDelay: 1000, // milliseconds
    });
  };

  return (
    <div>
      {state.errors.length > 0 && (
        <button onClick={retryFailedFiles} disabled={isRetrying}>
          {isRetrying ? 'Retrying...' : 'Retry Failed Uploads'}
        </button>
      )}
    </div>
  );
}
```

## Error Handling

The integration handles various error scenarios:

1. **No Session ID**: Alert shown if session is missing
2. **Invalid File Type**: Files filtered before upload
3. **File Too Large**: Validated before upload (50MB limit)
4. **Network Errors**: Retry logic with exponential backoff
5. **Server Errors**: Error messages displayed inline with each file
6. **Duplicate Files**: Inline warnings shown with existing file info

### Inline Error Messages
- **File-Specific Errors**: Each file displays its own error message directly below the progress bar
- **Visual Indicators**:
  - Yellow background and border for duplicate files
  - Red background and border for failed uploads
  - White background with blue border for successful uploads
- **Contextual Information**:
  - Duplicate files show the name of the existing document
  - Failed files show the specific error reason
- **No Generic Notifications**: Errors are attached to their respective files, not shown as global alerts

## Testing

### Unit Tests
Run the test suite:
```bash
npm test -- FileUpload.test.tsx
```

### Manual Testing

1. **Setup**
   - Start backend at `http://localhost:3200`
   - Login to create a session
   - Navigate to studio page

2. **Test Upload Flow**
   - Click file upload button in chat input
   - Select multiple PDF/TXT files
   - Observe real-time progress bars
   - Verify completion status

3. **Test Error Cases**
   - Upload without session
   - Upload invalid file types (e.g., images)
   - Upload files >50MB
   - Disconnect network during upload
   - Upload duplicate files

4. **Test UI Features**
   - Drag and drop files
   - Click to select files
   - Multiple file selection
   - Progress visualization
   - Error messages
   - Duplicate notifications

## Environment Configuration

Ensure the following environment variable is set:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3200
```

## Security Considerations

1. **Authentication**: Uses httpOnly cookies for JWT tokens
2. **Session Validation**: Session ID verified on backend
3. **File Validation**: Type and size checked before upload
4. **CORS**: Handled through Next.js API routes
5. **Content Security**: Files processed server-side

## Performance Optimizations

1. **Batch Processing**: Backend processes up to 5 files concurrently
2. **Progress Updates**: Throttled to prevent UI lag
3. **Memory Management**: File URLs cleaned up after use
4. **Deduplication**: Files checked by content hash, not name

## Troubleshooting

### Common Issues

1. **"No active session" error**
   - Ensure user is logged in
   - Check session ID is being passed correctly

2. **Upload stuck at 0%**
   - Check backend is running
   - Verify CORS settings
   - Check network connectivity

3. **Files rejected**
   - Verify file type (PDF/TXT only)
   - Check file size (<50MB)

4. **Duplicate notifications**
   - Normal behavior for identical files
   - Backend deduplicates by content hash

## Future Enhancements

Potential improvements for future iterations:

1. **Resume Interrupted Uploads**: Save progress and resume
2. **Batch Operations**: Upload folders or ZIP files
3. **Preview Enhancements**: Better PDF preview, syntax highlighting for code
4. **Metadata Extraction**: Auto-extract document metadata
5. **Progress Persistence**: Save upload state across page refreshes
6. **Compression**: Client-side compression for faster uploads
7. **Chunked Uploads**: Support for very large files (>50MB)

## Related Documentation

- Backend API Documentation (provided by backend team)
- Next.js Documentation: https://nextjs.org/docs
- React Hooks Documentation: https://react.dev/reference/react
- SSE Specification: https://html.spec.whatwg.org/multipage/server-sent-events.html