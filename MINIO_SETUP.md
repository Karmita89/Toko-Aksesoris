# MinIO Integration Setup Guide - AksChim

This guide explains how MinIO integration works in your AksChim e-commerce project.

## 📋 What Was Added

### 1. **docker-compose.yml** - MinIO Service
Added MinIO container with:
- **API Port**: 9000 (for file operations)
- **Console Port**: 9001 (web UI to manage buckets)
- **Storage**: Persistent volume named `minio-storage`
- **Credentials**: Configured via environment variables

### 2. **.env.local** - MinIO Configuration
```
MINIO_ROOT_USER=minioadmin           # Username for MinIO console
MINIO_ROOT_PASSWORD=minioadmin123    # Password for MinIO console
MINIO_ENDPOINT=http://minio:9000     # Internal Docker endpoint
MINIO_ACCESS_KEY=minioadmin          # Access key for API calls
MINIO_SECRET_KEY=minioadmin123       # Secret key for API calls
MINIO_BUCKET_NAME=akschim-images     # Bucket name for storing images
MINIO_USE_SSL=false                  # SSL disabled for local development
```

### 3. **lib/minio.ts** - MinIO Client
Helper functions for interacting with MinIO:
- `ensureBucket()` - Create bucket if it doesn't exist
- `uploadFile()` - Upload file to MinIO
- `getFileUrl()` - Get public URL for accessing files
- `deleteFile()` - Delete files from MinIO

### 4. **app/api/upload/route.ts** - Upload API
POST endpoint that:
- Accepts `multipart/form-data` with file field
- Validates file type (images only)
- Validates file size (max 5MB)
- Uploads to MinIO bucket
- Returns uploaded image URL

### 5. **components/ImageUploader.tsx** - React Component
UI component for uploading images:
- File input with drag-and-drop
- Image preview
- Upload progress feedback
- Error and success messages
- File validation

---

## 🚀 Getting Started

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Docker Services
```bash
docker-compose up -d
```

This will start:
- Next.js app (port 3000)
- MinIO service (port 9000 API, 9001 Console)

### Step 3: Create MinIO Bucket
The bucket is created automatically when you upload the first image. The API will create it if it doesn't exist.

---

## 📂 MinIO Console Access

Visit: **http://localhost:9001**

Login with:
- Username: `minioadmin`
- Password: `minioadmin123`

Here you can:
- View buckets
- Browse uploaded files
- Manage permissions
- Monitor storage usage

---

## 🖼️ How to Use in Your App

### Using the ImageUploader Component

```tsx
import ImageUploader from "@/components/ImageUploader";

export default function ProductPage() {
  return (
    <div>
      <h1>Add Product Image</h1>
      <ImageUploader />
    </div>
  );
}
```

### Manual Upload via API

```javascript
const formData = new FormData();
formData.append("file", imageFile);

const response = await fetch("/api/upload", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log(data.url); // Image URL
```

### Response Format

**Success (200):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "url": "http://minio:9000/akschim-images/images/my-image-1234567890.jpg",
  "fileName": "images/my-image-1234567890.jpg"
}
```

**Error (400/500):**
```json
{
  "error": "Only image files are allowed"
}
```

---

## 🔧 File Organization

Images are stored with this path structure:
```
akschim-images/
  └── images/
      ├── product-name-1234567890.jpg
      ├── product-name-1234567891.png
      └── ...
```

This makes it easy to organize and manage files.

---

## 📝 API Details

### POST /api/upload

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `file`

**Validation:**
- File type: JPG, PNG, GIF, WebP only
- Max size: 5MB
- Required field

**Response Fields:**
- `success` - Boolean indicating upload status
- `message` - Human-readable message
- `url` - Public URL to access the image
- `fileName` - Stored filename in MinIO

---

## 🛡️ Security Notes

This setup is designed for **local development only**:

- ✅ Simple credentials (no production use)
- ✅ No SSL (only for local Docker network)
- ✅ Basic file validation
- ✅ Fixed 5MB limit

For production, you should:
- Use strong passwords
- Enable SSL/TLS
- Implement authentication checks
- Add rate limiting
- Use proper MinIO policies
- Store credentials in secure secret management

---

## 🐛 Troubleshooting

### MinIO Container Won't Start
```bash
# Check container logs
docker-compose logs minio

# Restart services
docker-compose down
docker-compose up -d
```

### Upload API Returns 500 Error
- Check MinIO container is running: `docker-compose ps`
- Verify environment variables in `.env.local`
- Check browser console for detailed errors

### Image URL Not Accessible
- Ensure MinIO container is running
- Verify bucket name matches `MINIO_BUCKET_NAME`
- Check endpoint in `.env.local` (use `http://localhost:9000` for browser access)

### File Size Limit
To change the 5MB limit, edit `app/api/upload/route.ts`:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
```

---

## 📚 Next Steps

1. **Add Product Images** - Integrate ImageUploader with product creation form
2. **Create Image Gallery** - Display product images from MinIO URLs
3. **Delete Old Images** - Use `deleteFile()` function when updating products
4. **Image Optimization** - Add image resizing/optimization before upload
5. **User Permissions** - Add authentication checks to upload endpoint

---

## 🎓 Learning Resources

- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
- [MinIO Node.js SDK](https://github.com/minio/minio-js)
- [Docker Compose Guide](https://docs.docker.com/compose/)

---

**Happy coding! 🚀**
