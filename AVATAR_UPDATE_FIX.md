# Fix Avatar Update Issue - Using Correct API Endpoint

## Vấn đề
- Upload avatar thành công nhưng không update trong profile
- Frontend đang gọi sai API endpoint

## Phân tích

### Backend có 2 API upload avatar:
1. **`/api/File/upload-avatar`** - General file upload service
   - Chỉ upload file và trả về URL
   - Không tự động update user profile

2. **`/api/users/upload-avatar`** - User-specific avatar upload  
   - Upload file VÀ tự động update user profile
   - Endpoint chuyên dụng cho avatar

### Frontend ban đầu:
- Gọi `/api/File/upload-avatar` 
- Sau đó manually gọi `updateUserProfile({ avatar: url })`
- Nhưng `UpdateUserProfileDto` không có field `avatar`
- → Update profile fail silently

## Giải pháp

### 1. Sửa UserService
```typescript
// Thay đổi từ FileService sang direct API call
uploadAvatar(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(`${this.API_BASE}/users/upload-avatar`, formData, { responseType: 'text' }).pipe(
    tap(() => {
      // Auto-reload profile sau khi upload
      this.loadUserProfile();
    }),
    catchError(this.handleError)
  );
}
```

### 2. Sửa ProfileComponent  
```typescript
uploadAvatarOnly() {
  this.userService.uploadAvatar(this.selectedFile).subscribe({
    next: (result) => {
      // Không cần manual update profile nữa
      this.successMessage = 'Cập nhật ảnh đại diện thành công!';
      // Profile sẽ auto-reload từ UserService
    }
  });
}
```

### 3. Sửa updateUserProfileWithAvatar
```typescript
updateUserProfileWithAvatar(profile: Partial<UserProfile>, avatarFile?: File): Observable<UserProfile> {
  if (avatarFile) {
    // Upload avatar trước (auto-update profile)
    return this.uploadAvatar(avatarFile).pipe(
      switchMap(() => {
        // Sau đó update các field khác
        return this.updateUserProfile(profile);
      })
    );
  } else {
    return this.updateUserProfile(profile);
  }
}
```

## Kết quả sau khi fix

### Upload Avatar Flow:
1. User chọn file → Preview
2. Click "Tải lên ảnh" → Call `/api/users/upload-avatar`
3. Backend upload file + tự động update user profile
4. Frontend auto-reload profile → Avatar hiển thị mới
5. Success message hiển thị

### Update Profile với Avatar Flow:
1. User update profile info + chọn avatar file
2. Click "Cập nhật" → Upload avatar trước
3. Avatar được set tự động
4. Sau đó update các field khác
5. Profile hoàn tất cập nhật

## Testing

### ✅ Test Cases:
- [x] Upload avatar riêng lẻ → Profile update ngay
- [x] Update profile + avatar cùng lúc → Cả 2 đều update
- [x] Update profile không có avatar → Hoạt động bình thường
- [x] Error handling cho upload fail
- [x] Loading states hiển thị đúng
- [x] Console logs cho debugging

### API Calls:
```
// Upload avatar only
POST /api/users/upload-avatar
→ Profile auto-updated

// Update profile with avatar  
POST /api/users/upload-avatar (avatar tự động update profile)
PUT /api/users/profile (update other fields)

// Update profile without avatar
PUT /api/users/profile
```

## Advantages

### UX Improvements:
- ✅ Avatar update instantly visible
- ✅ Single action for avatar upload
- ✅ Consistent behavior
- ✅ Better error handling

### Code Quality:
- ✅ Uses correct specialized endpoint
- ✅ Reduces API calls
- ✅ Simpler error handling
- ✅ Auto profile sync

### Backend Integration:
- ✅ Leverages backend logic
- ✅ Consistent with API design
- ✅ Better separation of concerns
- ✅ Reduced frontend complexity 