# Tính năng Upload Avatar & Transaction Images

## Tổng quan
Đã triển khai tính năng upload avatar cho profile và upload ảnh cho transaction sử dụng API endpoints từ backend.

## Các tính năng đã triển khai

### 1. FileService (`src/app/core/services/file/file.service.ts`)
- **Upload Avatar**: `uploadAvatar(file: File)` - Upload ảnh đại diện
- **Upload File**: `uploadFile(file: File, folder?, width?, height?)` - Upload file chung
- **Delete File**: `deleteFile(fileUrl: string)` - Xóa file theo URL
- Xử lý error tập trung và trả về message tiếng Việt

### 2. UserService Updates
- **Upload Avatar Integration**: Tích hợp với FileService
- **Update Profile with Avatar**: `updateUserProfileWithAvatar()` - Cập nhật profile kèm avatar
- Giữ nguyên các method khác và cache management

### 3. Profile Component Enhancement
#### Features:
- **Avatar Preview**: Hiển thị ảnh đại diện hiện tại
- **File Selection**: Chọn ảnh với validation (5MB limit, image types only)
- **Preview**: Preview ảnh đã chọn trước khi upload
- **Upload Avatar**: Nút tải lên riêng biệt
- **Loading States**: Hiển thị trạng thái đang tải
- **Error Handling**: Hiển thị lỗi nếu có

#### UI/UX:
- Avatar tròn 96x96px với placeholder
- Nút "Chọn ảnh" và "Tải lên ảnh" riêng biệt
- Loading spinner khi đang upload
- Nút "Xóa ảnh đã chọn" để reset selection

### 4. Transaction Form Enhancement
#### Features:
- **Image Upload**: Upload ảnh cho transaction
- **Image Preview**: Preview ảnh 128x128px
- **File Validation**: 10MB limit, image types only
- **Remove Image**: Xóa ảnh đã chọn/tồn tại
- **Edit Mode Support**: Hiển thị ảnh hiện tại khi edit

#### UI/UX:
- Thay thế input URL bằng file upload
- Preview ảnh với nút X để xóa
- Loading states cho upload process
- Disable buttons khi đang upload

## API Integration

### Upload Avatar Endpoint
```
POST /api/File/upload-avatar
Content-Type: multipart/form-data
Body: { file: File }
Response: {
  succeeded: boolean,
  data: {
    url: string,
    fileName: string,
    size: number,
    contentType: string,
    uploadedAt: string
  }
}
```

### Upload File Endpoint
```
POST /api/File/upload?folder=transactions&width=800&height=600
Content-Type: multipart/form-data  
Body: { file: File }
Response: Same as upload-avatar
```

## Validation Rules

### Avatar Upload:
- File size: Max 5MB
- File types: image/* (jpg, png, gif, etc.)
- Auto-resize to appropriate dimensions

### Transaction Image Upload:
- File size: Max 10MB
- File types: image/* 
- Stored in 'transactions' folder
- Optional resizing with width/height parameters

## User Experience

### Success Flow:
1. User selects file → Preview shows
2. User clicks upload → Loading state
3. Upload success → Update UI, clear selection
4. Show success message

### Error Handling:
1. File validation errors → Show immediately
2. Upload errors → Show error message
3. Network errors → Graceful handling with retry option

## Security & Performance

### Client-side:
- File type validation
- File size validation
- Progress indication
- Error boundary handling

### Server-side (handled by backend):
- File type verification
- Virus scanning
- Storage optimization
- CDN integration

## Future Enhancements

### Planned:
- [ ] Image cropping before upload
- [ ] Multiple image upload for transactions
- [ ] Image compression
- [ ] Upload progress bar
- [ ] Drag & drop support
- [ ] Image galleries for transactions

### Nice to have:
- [ ] Image filters/effects
- [ ] OCR for receipt scanning
- [ ] Auto-categorization based on image content
- [ ] Cloud storage integration (AWS S3, etc.)

## Testing

### Manual Testing:
✅ Upload avatar in profile
✅ Upload transaction image
✅ File validation (size & type)
✅ Preview functionality
✅ Remove/cancel functionality
✅ Loading states
✅ Error handling
✅ Edit mode with existing images

### Integration Testing:
✅ API endpoint integration
✅ Form submission with images
✅ Profile update with avatar
✅ Transaction CRUD with images

## Development Notes

### Dependencies Added:
- No new dependencies (uses built-in FileReader, FormData)
- Reuses existing HTTP client and error handling

### Code Quality:
- TypeScript strict typing
- Proper error handling
- Consistent naming conventions
- Reusable FileService
- Clean separation of concerns

### Performance:
- File validation on client-side first
- Async/await for better control flow
- Proper memory management for file previews
- Optimized bundle size (no additional libs) 