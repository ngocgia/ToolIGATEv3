# Admin Dashboard - Hệ thống quản trị

Một trang web admin dashboard hiện đại, responsive và đầy đủ tính năng được xây dựng bằng HTML, CSS và JavaScript thuần.

## 🚀 Tính năng

### 📊 Dashboard
- **Thống kê tổng quan**: Hiển thị số liệu người dùng, sản phẩm, đơn hàng và doanh thu
- **Biểu đồ tương tác**: Biểu đồ doanh thu và đơn hàng theo thời gian
- **Hoạt động gần đây**: Theo dõi các hoạt động mới nhất trong hệ thống

### 👥 Quản lý người dùng
- Xem danh sách người dùng với thông tin chi tiết
- Thêm người dùng mới
- Chỉnh sửa thông tin người dùng
- Xóa người dùng
- Tìm kiếm và lọc người dùng

### 📦 Quản lý sản phẩm
- Quản lý danh sách sản phẩm
- Thêm sản phẩm mới với hình ảnh
- Cập nhật thông tin sản phẩm
- Quản lý tồn kho
- Phân loại sản phẩm theo danh mục

### 🛒 Quản lý đơn hàng
- Theo dõi trạng thái đơn hàng
- Xem chi tiết đơn hàng
- Cập nhật trạng thái đơn hàng
- Quản lý thông tin khách hàng

### 📈 Thống kê và phân tích
- Biểu đồ phân tích người dùng
- Thống kê sản phẩm theo danh mục
- Biểu đồ doanh thu theo tháng
- Top sản phẩm bán chạy

### ⚙️ Cài đặt hệ thống
- Cài đặt chung (tên website, email, múi giờ)
- Cài đặt bảo mật (mật khẩu, xác thực 2 yếu tố)
- Ghi log hệ thống

## 🎨 Thiết kế

### Giao diện hiện đại
- **Responsive Design**: Tương thích với mọi thiết bị
- **Dark/Light Theme**: Giao diện sáng với gradient đẹp mắt
- **Smooth Animations**: Hiệu ứng chuyển động mượt mà
- **Modern UI/UX**: Thiết kế theo xu hướng hiện đại

### Màu sắc và Typography
- **Font**: Inter (Google Fonts)
- **Icons**: Font Awesome 6
- **Color Scheme**: Gradient tím-xanh hiện đại
- **Typography**: Clean và dễ đọc

## 📁 Cấu trúc file

```
toolOfGia/
├── login.html          # Trang đăng nhập
├── login-styles.css    # CSS cho trang đăng nhập
├── login-script.js     # JavaScript cho trang đăng nhập
├── index.html          # Trang admin dashboard (cần đăng nhập)
├── styles.css          # CSS cho admin dashboard
├── script.js           # JavaScript cho admin dashboard
├── package.json        # Dependencies cho Node.js
└── README.md           # Hướng dẫn sử dụng
```

## 🛠️ Cài đặt và sử dụng

### 1. Tải xuống
```bash
git clone <repository-url>
cd toolOfGia
```

### 2. Chạy ứng dụng
Mở file `index.html` trong trình duyệt web hoặc sử dụng local server:

```bash
# Sử dụng Python
python -m http.server 8000

# Sử dụng Node.js
npx serve .

# Sử dụng PHP
php -S localhost:8000
```

### 3. Truy cập
Mở trình duyệt và truy cập: `http://localhost:8000`

## 🔧 Tùy chỉnh

### Thay đổi màu sắc
Chỉnh sửa file `styles.css`:

```css
/* Thay đổi màu chủ đạo */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #fbbf24;
}
```

### Thêm tính năng mới
1. Thêm HTML cho tính năng mới trong `index.html`
2. Thêm CSS styling trong `styles.css`
3. Thêm JavaScript logic trong `script.js`

### Tích hợp với Backend
Khi bạn phát triển backend (Node.js/Python), thay thế các hàm mock data trong `script.js`:

```javascript
// Thay thế mock data bằng API calls
async function loadUsersData() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        this.displayUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}
```

## 📱 Responsive Design

Dashboard được thiết kế responsive với các breakpoint:

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

### Mobile Features
- Sidebar có thể ẩn/hiện
- Menu hamburger cho mobile
- Bảng dữ liệu scrollable
- Modal full-width trên mobile

## 🎯 Tính năng nâng cao

### Search và Filter
- Tìm kiếm real-time
- Lọc theo trạng thái
- Sắp xếp theo cột

### Notifications
- Hệ thống thông báo toast
- Auto-dismiss sau 5 giây
- 4 loại thông báo: success, error, warning, info

### Data Management
- CRUD operations đầy đủ
- Validation form
- Confirmation dialogs

## 🔒 Bảo mật

### Frontend Security
- Input validation
- XSS prevention
- CSRF protection (khi tích hợp backend)

### Authentication (Khi tích hợp backend)
```javascript
// Kiểm tra đăng nhập
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login';
    }
}
```

## 🚀 Deployment

### Static Hosting
Có thể deploy lên các platform:
- **Netlify**: Kéo thả folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Push code lên GitHub
- **Firebase Hosting**: Sử dụng Firebase CLI

### Production Build
```bash
# Minify CSS
npm install -g clean-css-cli
cleancss -o styles.min.css styles.css

# Minify JavaScript
npm install -g uglify-js
uglifyjs script.js -o script.min.js
```

## 📊 Performance

### Optimization
- **Lazy Loading**: Load data khi cần
- **Debounced Search**: Tối ưu tìm kiếm
- **Efficient DOM**: Minimal DOM manipulation
- **CSS Optimization**: Efficient selectors

### Loading States
- Skeleton loading cho bảng
- Spinner cho async operations
- Progress indicators

## 🔧 Troubleshooting

### Common Issues

1. **Font Awesome không hiển thị**
   - Kiểm tra kết nối internet
   - Thay thế bằng CDN khác

2. **Charts không render**
   - Kiểm tra console errors
   - Đảm bảo canvas elements tồn tại

3. **Modal không mở**
   - Kiểm tra JavaScript errors
   - Đảm bảo modal IDs đúng

### Debug Mode
```javascript
// Bật debug mode
localStorage.setItem('debug', 'true');
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 📞 Liên hệ

- **Email**: admin@example.com
- **GitHub**: [Your GitHub Profile]
- **Website**: [Your Website]

---

**Lưu ý**: Đây là phiên bản frontend demo. Để sử dụng trong production, bạn cần tích hợp với backend API và database. 