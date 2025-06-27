# My Budget Management Frontend

## 📋 Tổng quan dự án

My Budget Management Frontend là ứng dụng quản lý tài chính cá nhân được xây dựng bằng Angular 18, cung cấp giao diện người dùng hiện đại và responsive để quản lý thu chi, ngân sách và các mục tiêu tài chính.

## ✨ Tính năng chính

### 🏠 Dashboard
- Tổng quan tài chính tức thời (thu nhập, chi tiêu, số dư)
- Biểu đồ phân tích chi tiêu theo danh mục
- Giao dịch gần đây và các thao tác nhanh
- Tìm kiếm toàn cục với autocomplete

### 💰 Quản lý giao dịch
- Thêm, sửa, xóa giao dịch thu/chi
- Lọc và tìm kiếm giao dịch theo thời gian
- Upload hình ảnh hóa đơn
- Phân loại theo danh mục

### 📂 Quản lý danh mục
- Tạo danh mục thu/chi tùy chỉnh
- Thiết lập ngân sách cho từng danh mục
- Theo dõi tỷ lệ sử dụng ngân sách
- Icon và màu sắc tùy chỉnh

### 📊 Báo cáo và thống kê
- Biểu đồ tròn phân tích chi tiêu
- Xu hướng thu chi theo thời gian
- Báo cáo tổng hợp theo tháng/năm

### 💳 Quản lý nợ/cho vay
- Theo dõi các khoản nợ phải trả/thu
- Lịch sử thanh toán
- Nhắc nhở hạn thanh toán

### 👤 Quản lý hồ sơ
- Thông tin cá nhân và avatar
- Thiết lập đơn vị tiền tệ
- Đổi mật khẩu và bảo mật

## 🛠️ Công nghệ sử dụng

### Frontend Framework
- **Angular 18** - Framework chính
- **TypeScript** - Ngôn ngữ lập trình
- **RxJS** - Quản lý dữ liệu bất đồng bộ

### UI/UX
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide Angular** - Thư viện icon hiện đại
- **Responsive Design** - Tương thích đa thiết bị

### Quản lý trạng thái
- **BehaviorSubject** - Quản lý state reactive
- **HTTP Interceptors** - Xử lý authentication
- **Route Guards** - Bảo vệ routes

## 🎨 Thiết kế UI/UX

### Màu sắc chủ đạo
- **Primary**: `#1e40af` (Blue-700)
- **Secondary**: `#4e7397` (Blue-gray)
- **Success**: `#059669` (Green-600)
- **Warning**: `#d97706` (Orange-600)
- **Error**: `#dc2626` (Red-600)

### Typography
- **Font chính**: Inter
- **Font phụ**: Noto Sans
- **Kích thước**: Responsive typography scale

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.x
- npm >= 8.x
- Angular CLI >= 18.x

### Hướng dẫn cài đặt

1. **Clone repository**
   ```bash
   git clone [repository-url]
   cd MyBudgetManagementFE
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Cấu hình environment**
   ```bash
   # Sửa file src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'YOUR_API_URL'
   };
   ```

4. **Chạy development server**
   ```bash
   ng serve
   ```
   Ứng dụng sẽ chạy tại `http://localhost:4200`

5. **Build production**
   ```bash
   ng build --prod
   ```

## 📁 Cấu trúc dự án

```
src/
├── app/
│   ├── core/                 # Core modules
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors  
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # Business services
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── dashboard/      # Dashboard
│   │   ├── transactions/   # Transaction management
│   │   ├── categories/     # Category management
│   │   ├── debt-loan/      # Debt/Loan management
│   │   └── reports/        # Reports & Analytics
│   ├── layout/             # Layout components
│   │   ├── header/         # App header
│   │   ├── sidebar/        # Navigation sidebar
│   │   └── main-layout/    # Main layout wrapper
│   └── shared/             # Shared components
├── assets/                 # Static assets  
├── environments/           # Environment configs
└── styles.css             # Global styles
```

## 🔧 Scripts chính

```bash
# Development
npm start                 # Chạy dev server
npm run build            # Build production
npm run watch            # Build và watch changes
npm run test             # Chạy unit tests
npm run lint             # Kiểm tra code style

# Production
npm run build:prod       # Build tối ưu cho production
npm run serve:prod       # Serve production build
```

## 🔐 Authentication Flow

1. **Login/Register** - Xác thực người dùng
2. **JWT Token** - Lưu trữ và quản lý token
3. **Auto Refresh** - Tự động gia hạn token
4. **Route Protection** - Bảo vệ routes yêu cầu auth
5. **HTTP Interceptor** - Tự động thêm Authorization header

## 📱 Responsive Design

- **Desktop**: >= 1024px - Layout đầy đủ với sidebar
- **Tablet**: 768px - 1023px - Layout responsive
- **Mobile**: < 768px - Layout mobile với hamburger menu

## 🎯 Performance Optimization

### Lazy Loading
- Routes được lazy load để giảm bundle size
- Component lazy loading cho các feature modules

### Bundle Optimization  
- Tree shaking loại bỏ code không sử dụng
- Code splitting tách các chunk riêng biệt
- Image optimization và lazy loading

### Caching Strategy
- HTTP response caching
- User profile caching với TTL
- Asset caching với service worker

## 🧪 Testing

### Unit Tests
```bash
ng test                  # Chạy unit tests với Karma
ng test --watch=false    # Chạy một lần
ng test --code-coverage  # Tạo coverage report
```

### E2E Tests
```bash
ng e2e                   # Chạy end-to-end tests
```

## 🚀 Deployment

### Build Production
```bash
ng build --configuration production
```

### Docker Deployment
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/dist/my-budget-management-fe /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables
- `API_URL` - URL của backend API
- `PRODUCTION` - Flag môi trường production

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Hỗ trợ

Nếu có vấn đề hoặc câu hỏi:
- Tạo issue trên GitHub
- Email: support@mybudgetmanagement.com
- Documentation: [Link to docs]

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

---

**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: January 2024
