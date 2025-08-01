// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.userData = null;
        this.init();
    }

    init() {
        // Check authentication first
        if (!this.checkAuthentication()) {
            return;
        }
        
        this.setupEventListeners();
        this.loadMockData();
        this.initializeCharts();
        this.updatePageTitle();
        this.updateUserInfo();
    }

    checkAuthentication() {
        const authToken = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (!authToken || !userData) {
            // Not authenticated, redirect to login
            window.location.href = 'login.html';
            return false;
        }

        try {
            this.userData = JSON.parse(userData);
            
            // Check if token is expired (simple check for demo)
            const tokenData = this.parseAuthToken(authToken);
            const tokenAge = Date.now() - tokenData.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (tokenAge > maxAge) {
                // Token expired
                this.logout();
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error parsing user data:', error);
            this.logout();
            return false;
        }
    }

    parseAuthToken(token) {
        try {
            const decoded = atob(token);
            const parts = decoded.split(':');
            return {
                userId: parts[0],
                username: parts[1],
                timestamp: parseInt(parts[2]),
                random: parts[3]
            };
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    updateUserInfo() {
        if (!this.userData) return;

        // Update user name in header
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = this.userData.name;
        }

        // Update user avatar
        const userAvatarElement = document.querySelector('.user-avatar');
        if (userAvatarElement && this.userData.avatar) {
            userAvatarElement.src = this.userData.avatar;
        }

        // Update page title with user info
        document.title = `Admin Dashboard - ${this.userData.name}`;
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Form submissions
        this.setupFormSubmissions();

        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // User menu
        this.setupUserMenu();
    }

    setupUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        if (!userMenu) return;

        // Create user dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'user-dropdown';
        dropdownMenu.innerHTML = `
            <div class="dropdown-header">
                <img src="${this.userData?.avatar || 'https://via.placeholder.com/40'}" alt="User" class="dropdown-avatar">
                <div class="dropdown-user-info">
                    <div class="dropdown-user-name">${this.userData?.name || 'User'}</div>
                    <div class="dropdown-user-role">${this.userData?.role || 'user'}</div>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-menu">
                <a href="#" class="dropdown-item" data-action="profile">
                    <i class="fas fa-user"></i>
                    <span>Hồ sơ</span>
                </a>
                <a href="#" class="dropdown-item" data-action="settings">
                    <i class="fas fa-cog"></i>
                    <span>Cài đặt</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item" data-action="logout">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Đăng xuất</span>
                </a>
            </div>
        `;

        userMenu.appendChild(dropdownMenu);

        // Toggle dropdown
        userMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('active');
        });

        // Handle dropdown actions
        dropdownMenu.addEventListener('click', (e) => {
            const action = e.target.closest('.dropdown-item')?.getAttribute('data-action');
            if (!action) return;

            e.preventDefault();
            e.stopPropagation();

            switch (action) {
                case 'profile':
                    this.showUserProfile();
                    break;
                case 'settings':
                    this.switchSection('settings');
                    break;
                case 'logout':
                    this.logout();
                    break;
            }

            dropdownMenu.classList.remove('active');
        });
    }

    switchSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update page title
        this.currentSection = sectionName;
        this.updatePageTitle();

        // Close mobile sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    updatePageTitle() {
        const titles = {
            dashboard: 'Dashboard',
            users: 'Quản lý người dùng',
            products: 'Quản lý sản phẩm',
            orders: 'Quản lý đơn hàng',
            analytics: 'Thống kê',
            settings: 'Cài đặt'
        };

        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = titles[this.currentSection] || 'Dashboard';
        }
    }

    loadSectionData(section) {
        switch (section) {
            case 'users':
                this.loadUsersData();
                break;
            case 'products':
                this.loadProductsData();
                break;
            case 'orders':
                this.loadOrdersData();
                break;
            case 'analytics':
                this.initializeAnalyticsCharts();
                break;
        }
    }

    loadMockData() {
        // Mock data for demonstration
        this.mockUsers = [
            { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'Admin', status: 'active', created: '2024-01-15' },
            { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', role: 'User', status: 'active', created: '2024-01-20' },
            { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'Moderator', status: 'inactive', created: '2024-01-25' },
            { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'User', status: 'active', created: '2024-02-01' },
            { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com', role: 'User', status: 'pending', created: '2024-02-05' }
        ];

        this.mockProducts = [
            { id: 1, name: 'Laptop Gaming', category: 'Điện tử', price: 25000000, stock: 15, status: 'active', image: 'https://via.placeholder.com/40' },
            { id: 2, name: 'Điện thoại iPhone', category: 'Điện tử', price: 15000000, stock: 25, status: 'active', image: 'https://via.placeholder.com/40' },
            { id: 3, name: 'Tai nghe Bluetooth', category: 'Phụ kiện', price: 2000000, stock: 50, status: 'active', image: 'https://via.placeholder.com/40' },
            { id: 4, name: 'Bàn phím cơ', category: 'Phụ kiện', price: 1500000, stock: 30, status: 'inactive', image: 'https://via.placeholder.com/40' },
            { id: 5, name: 'Chuột gaming', category: 'Phụ kiện', price: 800000, stock: 40, status: 'active', image: 'https://via.placeholder.com/40' }
        ];

        this.mockOrders = [
            { id: 'ORD-001', customer: 'Nguyễn Văn A', products: 'Laptop Gaming', total: 25000000, status: 'completed', date: '2024-02-10' },
            { id: 'ORD-002', customer: 'Trần Thị B', products: 'Điện thoại iPhone', total: 15000000, status: 'processing', date: '2024-02-11' },
            { id: 'ORD-003', customer: 'Lê Văn C', products: 'Tai nghe Bluetooth', total: 2000000, status: 'pending', date: '2024-02-12' },
            { id: 'ORD-004', customer: 'Phạm Thị D', products: 'Bàn phím cơ', total: 1500000, status: 'completed', date: '2024-02-13' },
            { id: 'ORD-005', customer: 'Hoàng Văn E', products: 'Chuột gaming', total: 800000, status: 'cancelled', date: '2024-02-14' }
        ];
    }

    loadUsersData() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.mockUsers.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><span class="status-badge status-${user.status}">${this.getStatusText(user.status)}</span></td>
                <td>${user.created}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminDashboard.editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadProductsData() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.mockProducts.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${this.formatCurrency(product.price)}</td>
                <td>${product.stock}</td>
                <td><span class="status-badge status-${product.status}">${this.getStatusText(product.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminDashboard.editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadOrdersData() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.mockOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.products}</td>
                <td>${this.formatCurrency(order.total)}</td>
                <td><span class="status-badge status-${order.status}">${this.getStatusText(order.status)}</span></td>
                <td>${order.date}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminDashboard.viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="adminDashboard.updateOrderStatus('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            active: 'Hoạt động',
            inactive: 'Không hoạt động',
            pending: 'Chờ xử lý',
            completed: 'Hoàn thành',
            processing: 'Đang xử lý',
            cancelled: 'Đã hủy'
        };
        return statusMap[status] || status;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    initializeCharts() {
        // Simple chart implementation using canvas
        this.drawRevenueChart();
        this.drawOrdersChart();
    }

    initializeAnalyticsCharts() {
        this.drawUserAnalyticsChart();
        this.drawProductAnalyticsChart();
        this.drawMonthlyRevenueChart();
    }

    drawRevenueChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = [12000, 19000, 15000, 25000, 22000, 30000, 28000];
        const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        this.drawLineChart(ctx, data, labels, '#667eea');
    }

    drawOrdersChart() {
        const canvas = document.getElementById('ordersChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = [45, 52, 38, 67, 58, 75, 89];
        const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        this.drawBarChart(ctx, data, labels, '#f093fb');
    }

    drawUserAnalyticsChart() {
        const canvas = document.getElementById('userAnalyticsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = [60, 25, 15];
        const labels = ['Admin', 'User', 'Moderator'];

        this.drawPieChart(ctx, data, labels);
    }

    drawProductAnalyticsChart() {
        const canvas = document.getElementById('productAnalyticsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = [40, 30, 20, 10];
        const labels = ['Điện tử', 'Phụ kiện', 'Thời trang', 'Khác'];

        this.drawDoughnutChart(ctx, data, labels);
    }

    drawMonthlyRevenueChart() {
        const canvas = document.getElementById('monthlyRevenueChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = [150000, 180000, 220000, 280000, 320000, 380000, 420000, 450000, 480000, 520000, 580000, 650000];
        const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

        this.drawLineChart(ctx, data, labels, '#43e97b');
    }

    drawLineChart(ctx, data, labels, color) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 40;

        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue;

        ctx.clearRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height - 2 * padding) * i / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw line
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        data.forEach((value, index) => {
            const x = padding + (width - 2 * padding) * index / (data.length - 1);
            const y = height - padding - (value - minValue) / range * (height - 2 * padding);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points
        ctx.fillStyle = color;
        data.forEach((value, index) => {
            const x = padding + (width - 2 * padding) * index / (data.length - 1);
            const y = height - padding - (value - minValue) / range * (height - 2 * padding);
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    drawBarChart(ctx, data, labels, color) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 40;

        const maxValue = Math.max(...data);
        const barWidth = (width - 2 * padding) / data.length * 0.8;
        const barSpacing = (width - 2 * padding) / data.length * 0.2;

        ctx.clearRect(0, 0, width, height);

        // Draw bars
        ctx.fillStyle = color;
        data.forEach((value, index) => {
            const x = padding + index * (barWidth + barSpacing);
            const barHeight = (value / maxValue) * (height - 2 * padding);
            const y = height - padding - barHeight;
            
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }

    drawPieChart(ctx, data, labels) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        const total = data.reduce((sum, value) => sum + value, 0);
        const colors = ['#667eea', '#f093fb', '#43e97b'];

        ctx.clearRect(0, 0, width, height);

        let currentAngle = 0;
        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            currentAngle += sliceAngle;
        });
    }

    drawDoughnutChart(ctx, data, labels) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = Math.min(centerX, centerY) - 20;
        const innerRadius = outerRadius * 0.6;

        const total = data.reduce((sum, value) => sum + value, 0);
        const colors = ['#667eea', '#f093fb', '#43e97b', '#fbbf24'];

        ctx.clearRect(0, 0, width, height);

        let currentAngle = 0;
        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            ctx.fill();

            currentAngle += sliceAngle;
        });
    }

    setupFormSubmissions() {
        // Add user form
        const addUserForm = document.querySelector('#addUserModal form');
        if (addUserForm) {
            addUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddUser(e.target);
            });
        }

        // Add product form
        const addProductForm = document.querySelector('#addProductModal form');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddProduct(e.target);
            });
        }

        // Settings forms
        document.querySelectorAll('.settings-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSettingsSave(e.target);
            });
        });
    }

    handleAddUser(form) {
        const formData = new FormData(form);
        const userData = {
            name: formData.get('name') || form.querySelector('input[type="text"]').value,
            email: formData.get('email') || form.querySelector('input[type="email"]').value,
            password: formData.get('password') || form.querySelector('input[type="password"]').value,
            role: formData.get('role') || form.querySelector('select').value
        };

        // Add to mock data
        const newUser = {
            id: this.mockUsers.length + 1,
            ...userData,
            status: 'active',
            created: new Date().toISOString().split('T')[0]
        };

        this.mockUsers.push(newUser);
        this.loadUsersData();
        this.closeModal('addUserModal');
        this.showNotification('Người dùng đã được thêm thành công!', 'success');
        form.reset();
    }

    handleAddProduct(form) {
        const formData = new FormData(form);
        const productData = {
            name: formData.get('name') || form.querySelector('input[type="text"]').value,
            description: formData.get('description') || form.querySelector('textarea').value,
            category: formData.get('category') || form.querySelector('select').value,
            price: parseInt(formData.get('price') || form.querySelector('input[type="number"]').value),
            stock: parseInt(formData.get('stock') || form.querySelectorAll('input[type="number"]')[1].value)
        };

        // Add to mock data
        const newProduct = {
            id: this.mockProducts.length + 1,
            ...productData,
            status: 'active',
            image: 'https://via.placeholder.com/40'
        };

        this.mockProducts.push(newProduct);
        this.loadProductsData();
        this.closeModal('addProductModal');
        this.showNotification('Sản phẩm đã được thêm thành công!', 'success');
        form.reset();
    }

    handleSettingsSave(form) {
        this.showNotification('Cài đặt đã được lưu thành công!', 'success');
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.loadSectionData(this.currentSection);
            return;
        }

        const searchResults = [];
        const searchTerm = query.toLowerCase();

        switch (this.currentSection) {
            case 'users':
                searchResults.push(...this.mockUsers.filter(user => 
                    user.name.toLowerCase().includes(searchTerm) ||
                    user.email.toLowerCase().includes(searchTerm) ||
                    user.role.toLowerCase().includes(searchTerm)
                ));
                this.displaySearchResults(searchResults, 'users');
                break;
            case 'products':
                searchResults.push(...this.mockProducts.filter(product => 
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
                ));
                this.displaySearchResults(searchResults, 'products');
                break;
            case 'orders':
                searchResults.push(...this.mockOrders.filter(order => 
                    order.id.toLowerCase().includes(searchTerm) ||
                    order.customer.toLowerCase().includes(searchTerm) ||
                    order.products.toLowerCase().includes(searchTerm)
                ));
                this.displaySearchResults(searchResults, 'orders');
                break;
        }
    }

    displaySearchResults(results, type) {
        const tbody = document.getElementById(`${type}TableBody`);
        if (!tbody) return;

        if (results.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Không tìm thấy kết quả</td></tr>';
            return;
        }

        switch (type) {
            case 'users':
                tbody.innerHTML = results.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td><span class="status-badge status-${user.status}">${this.getStatusText(user.status)}</span></td>
                        <td>${user.created}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="adminDashboard.editUser(${user.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteUser(${user.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
                break;
            case 'products':
                tbody.innerHTML = results.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td><img src="${product.image}" alt="${product.name}"></td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${this.formatCurrency(product.price)}</td>
                        <td>${product.stock}</td>
                        <td><span class="status-badge status-${product.status}">${this.getStatusText(product.status)}</span></td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="adminDashboard.editProduct(${product.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteProduct(${product.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
                break;
            case 'orders':
                tbody.innerHTML = results.map(order => `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${order.products}</td>
                        <td>${this.formatCurrency(order.total)}</td>
                        <td><span class="status-badge status-${order.status}">${this.getStatusText(order.status)}</span></td>
                        <td>${order.date}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="adminDashboard.viewOrder('${order.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="adminDashboard.updateOrderStatus('${order.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
                break;
        }
    }

    // CRUD Operations
    editUser(userId) {
        const user = this.mockUsers.find(u => u.id === userId);
        if (user) {
            this.showNotification(`Chỉnh sửa người dùng: ${user.name}`, 'info');
            // Implement edit modal here
        }
    }

    deleteUser(userId) {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            this.mockUsers = this.mockUsers.filter(u => u.id !== userId);
            this.loadUsersData();
            this.showNotification('Người dùng đã được xóa thành công!', 'success');
        }
    }

    editProduct(productId) {
        const product = this.mockProducts.find(p => p.id === productId);
        if (product) {
            this.showNotification(`Chỉnh sửa sản phẩm: ${product.name}`, 'info');
            // Implement edit modal here
        }
    }

    deleteProduct(productId) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            this.mockProducts = this.mockProducts.filter(p => p.id !== productId);
            this.loadProductsData();
            this.showNotification('Sản phẩm đã được xóa thành công!', 'success');
        }
    }

    viewOrder(orderId) {
        const order = this.mockOrders.find(o => o.id === orderId);
        if (order) {
            this.showNotification(`Xem chi tiết đơn hàng: ${order.id}`, 'info');
            // Implement order detail modal here
        }
    }

    updateOrderStatus(orderId) {
        const order = this.mockOrders.find(o => o.id === orderId);
        if (order) {
            this.showNotification(`Cập nhật trạng thái đơn hàng: ${order.id}`, 'info');
            // Implement status update modal here
        }
    }

    logout() {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            // Clear authentication data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('rememberMe');
            
            // Show logout message
            this.showNotification('Đã đăng xuất thành công!', 'success');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    }

    showUserProfile() {
        if (!this.userData) return;

        // Create profile modal
        const modalId = 'userProfileModal';
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Hồ sơ người dùng</h3>
                    <button class="modal-close" onclick="adminDashboard.closeModal('${modalId}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="profile-info">
                        <div class="profile-avatar">
                            <img src="${this.userData.avatar}" alt="${this.userData.name}">
                        </div>
                        <div class="profile-details">
                            <div class="profile-item">
                                <label>Tên:</label>
                                <span>${this.userData.name}</span>
                            </div>
                            <div class="profile-item">
                                <label>Tên đăng nhập:</label>
                                <span>${this.userData.username}</span>
                            </div>
                            <div class="profile-item">
                                <label>Email:</label>
                                <span>${this.userData.email}</span>
                            </div>
                            <div class="profile-item">
                                <label>Vai trò:</label>
                                <span class="role-badge role-${this.userData.role}">${this.getRoleText(this.userData.role)}</span>
                            </div>
                            <div class="profile-item">
                                <label>Đăng nhập lúc:</label>
                                <span>${new Date(this.userData.loginTime).toLocaleString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.openModal(modalId);
    }

    getRoleText(role) {
        const roleMap = {
            admin: 'Quản trị viên',
            user: 'Người dùng',
            moderator: 'Điều hành viên'
        };
        return roleMap[role] || role;
    }

    // Modal functions
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }
}

// Global functions for HTML onclick handlers
function openModal(modalId) {
    if (window.adminDashboard) {
        adminDashboard.openModal(modalId);
    }
}

function closeModal(modalId) {
    if (window.adminDashboard) {
        adminDashboard.closeModal(modalId);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: background-color 0.3s ease;
    }

    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(style); 