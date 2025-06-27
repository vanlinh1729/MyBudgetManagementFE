# Fix Upload Avatar - 415 Unsupported Media Type

## Vấn đề
```
[18:18:45 INF] Request starting HTTP/2 POST https://100.95.203.4:7080/api/File/upload-avatar - application/json 183908
[18:18:45 INF] Executing endpoint '415 HTTP Unsupported Media Type'
```

Lỗi 415 khi upload avatar vì Content-Type bị set sai thành `application/json` thay vì `multipart/form-data`.

## Nguyên nhân
Auth Interceptor đang force set `Content-Type: application/json` cho tất cả HTTP requests, kể cả file upload.

## Giải pháp
Cập nhật `auth.interceptor.ts` để detect FormData requests và chỉ set Authorization header:

```typescript
// Check if this is a file upload request (FormData)
const isFileUpload = req.body instanceof FormData;

if (isFileUpload) {
  // For file uploads, only add Authorization header, let browser set Content-Type
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
} else {
  // For regular requests, add both Authorization and Content-Type
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}
```

## Chi tiết thay đổi

### Trước khi fix:
- Tất cả requests đều có `Content-Type: application/json`
- File upload bị reject với 415 error

### Sau khi fix:
- FormData requests: Chỉ có Authorization header
- JSON requests: Có cả Authorization và Content-Type
- Browser tự động set `Content-Type: multipart/form-data` cho FormData

## Testing
1. Build successful ✅
2. Interceptor detect FormData correctly ✅  
3. Upload avatar với correct Content-Type ✅
4. Refresh token cũng handle FormData ✅

## Ảnh hưởng
- ✅ File upload hoạt động bình thường
- ✅ API calls khác không bị ảnh hưởng
- ✅ Authentication vẫn hoạt động
- ✅ Token refresh vẫn hoạt động

## Console Debug
Thêm logging trong ProfileComponent để track upload process:
```typescript
console.log('Uploading file:', this.selectedFile.name, 'Size:', this.selectedFile.size, 'Type:', this.selectedFile.type);
console.log('Upload successful:', uploadResult);
console.error('Upload error:', error);
``` 