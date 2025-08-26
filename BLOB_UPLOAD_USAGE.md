# Vercel Blob Multi-Part Upload Usage

## Overview

The video upload functionality now uses Vercel Blob's **client-side upload** with server token exchange for security. Files are uploaded directly from the browser to Vercel Blob after secure token exchange, providing multi-part upload support for better performance and reliability when uploading large video files.

## Updated Hook Usage

The `useUpdateScreen` hook now includes upload progress tracking:

```typescript
import { useUpdateScreen } from "@/app/components/hooks/useUpdateScreen";

function VideoUploadComponent() {
  const { mutate, loading, uploadProgress, error, success } = useUpdateScreen();

  const handleUpload = async (screenIndex: number, videoFile: File) => {
    await mutate(screenIndex, videoFile);
  };

  return (
    <div>
      {loading && (
        <div>
          {uploadProgress ? (
            <div>
              <p>Uploading: {uploadProgress.percentage}%</p>
              <progress
                value={uploadProgress.loaded}
                max={uploadProgress.total}
              />
              <p>
                {(uploadProgress.loaded / 1024 / 1024).toFixed(2)} MB /{" "}
                {(uploadProgress.total / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <p>Processing...</p>
          )}
        </div>
      )}

      {error && <p className="error">Error: {error}</p>}
      {success && <p className="success">Upload successful!</p>}

      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleUpload(1, file); // Replace 1 with actual screen index
          }
        }}
      />
    </div>
  );
}
```

## Upload Process

1. **Token Exchange**: Client requests upload token from server API route for security
2. **Client-side Upload to Blob**: The video file is uploaded directly from browser to Vercel Blob using multi-part upload
3. **Progress Tracking**: Real-time upload progress with percentage and size information
4. **Screen Update**: Once uploaded, the screen is updated with the blob URL

## Features

- **Client-side Upload**: Direct upload from browser to Vercel Blob (no server bandwidth usage)
- **Secure Token Exchange**: Server-side token generation for authorized uploads only
- **Multi-part Upload**: Handles large video files efficiently
- **Progress Tracking**: Real-time upload progress updates
- **File Validation**: Validates video file types before upload
- **Error Handling**: Comprehensive error handling for both upload and API calls
- **No Server Overhead**: Files don't pass through your server, reducing load and bandwidth costs

## Supported Video Formats

- MP4 (`video/mp4`)
- WebM (`video/webm`)
- QuickTime (`video/quicktime`)
- AVI (`video/x-msvideo`)
- WMV (`video/x-ms-wmv`)

## Environment Variables

Make sure to set up your environment variables in `.env.local`:

```bash
# Client-side upload with server token exchange (secure)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxx
```

## API Changes

The backend API now receives a `video_url` instead of a file upload:

```json
{
  "video_url": "https://blob.vercel-storage.com/videos/..."
}
```

Make sure your backend API is updated to handle URL-based video updates instead of file uploads.
