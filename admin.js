// Simple & Working Admin JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel loaded');
    
    // Default credentials
    const DEFAULT_PASSWORD = 'bashan2024';
    const SECURITY_ANSWER = 'mother';
    
    // DOM Elements
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');
    const resetForm = document.getElementById('resetForm');
    const forgotPassword = document.getElementById('forgotPassword');
    const backToLogin = document.getElementById('backToLogin');
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    const actionButtons = document.querySelectorAll('.action-btn');
    const pageTitle = document.getElementById('pageTitle');
    
    // Statistics elements
    const totalOrdersEl = document.getElementById('totalOrders');
    const totalProductsEl = document.getElementById('totalProducts');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const totalVisitsEl = document.getElementById('totalVisits');
    
    // Analytics elements
    const whatsappClicksEl = document.getElementById('whatsappClicks');
    const smsClicksEl = document.getElementById('smsClicks');
    const callClicksEl = document.getElementById('callClicks');
    const todayOrdersEl = document.getElementById('todayOrders');
    const todayVisitorsEl = document.getElementById('todayVisitors');
    const weekVisitorsEl = document.getElementById('weekVisitors');
    const monthVisitorsEl = document.getElementById('monthVisitors');
    const totalVisitorsCountEl = document.getElementById('totalVisitorsCount');
    
    // Music player elements
    const audioPlayer = document.getElementById('audioPlayer');
    const currentSongEl = document.getElementById('currentSong');
    const songArtistEl = document.getElementById('songArtist');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const uploadSongBtn = document.getElementById('uploadSongBtn');
    const uploadSongSection = document.getElementById('uploadSongSection');
    const songsContainer = document.getElementById('songsContainer');
    const songFileInput = document.getElementById('songFile');
    const songUploadArea = document.getElementById('songUploadArea');
    const saveSongBtn = document.getElementById('saveSongBtn');
    const cancelUploadBtn = document.getElementById('cancelUploadBtn');
    const miniPlayer = document.getElementById('miniPlayer');
    
    // Product form elements
    const addProductForm = document.getElementById('addProductForm');
    const productImageInput = document.getElementById('productImage');
    const uploadArea = document.getElementById('uploadArea');
    const imagePreview = document.getElementById('imagePreview');
    const productSearch = document.getElementById('productSearch');
    const productsList = document.getElementById('productsList');
    
    // Password form elements
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    // Notification elements
    const notificationCount = document.getElementById('notificationCount');
    const notificationToast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Initialize
    init();
    
    // Check login status
    checkLoginStatus();
    
    // Update time
    updateTime();
    setInterval(updateTime, 60000);
    
    // ===== EVENT LISTENERS =====
    
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            
            if (password === getStoredPassword()) {
                showNotification('Login successful!', 'success');
                localStorage.setItem('bashanLoggedIn', 'true');
                showAdminDashboard();
            } else {
                showNotification('Wrong password! Try again.', 'error');
            }
        });
    }
    
    // Forgot password
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            resetForm.style.display = 'flex';
        });
    }
    
    // Back to login
    if (backToLogin) {
        backToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            resetForm.style.display = 'none';
            loginForm.style.display = 'flex';
        });
    }
    
    // Reset password form
    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const securityAnswer = document.getElementById('securityAnswer').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (securityAnswer.toLowerCase() !== SECURITY_ANSWER) {
                showNotification('Wrong security answer!', 'error');
                return;
            }
            
            if (newPassword.length < 4) {
                showNotification('Password must be at least 4 characters', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            localStorage.setItem('bashanPassword', newPassword);
            showNotification('Password updated successfully!', 'success');
            
            // Reset and go back to login
            resetForm.reset();
            resetForm.style.display = 'none';
            loginForm.style.display = 'flex';
        });
    }
    
    // Menu navigation
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            
            if (section === 'logout') {
                logout();
                return;
            }
            
            switchSection(section);
            
            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Action buttons navigation
    actionButtons.forEach(btn => {
        if (btn.dataset.section) {
            btn.addEventListener('click', function() {
                const section = this.dataset.section;
                switchSection(section);
                
                // Update active menu item
                menuItems.forEach(i => {
                    i.classList.remove('active');
                    if (i.dataset.section === section) {
                        i.classList.add('active');
                    }
                });
            });
        }
    });
    
    // Cancel buttons
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        if (btn.dataset.section) {
            btn.addEventListener('click', function() {
                switchSection(this.dataset.section);
            });
        }
    });
    
    // Image upload
    if (uploadArea && productImageInput) {
        uploadArea.addEventListener('click', () => productImageInput.click());
        
        productImageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" style="max-width: 100%; border-radius: 8px;">
                        <button type="button" onclick="clearImagePreview()" style="margin-top: 10px; padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Remove Image
                        </button>
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Add product form
    if (addProductForm) {
        addProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const category = document.getElementById('productCategory').value;
            const name = document.getElementById('productName').value;
            const price = document.getElementById('productPrice').value;
            const description = document.getElementById('productDescription').value;
            const imageFile = productImageInput.files[0];
            
            if (!category || !name || !price) {
                showNotification('Please fill all required fields', 'error');
                return;
            }
            
            if (!imageFile) {
                showNotification('Please select an image', 'error');
                return;
            }
            
            try {
                // Convert image to base64
                const imageBase64 = await fileToBase64(imageFile);
                
                // Create product
                const product = {
                    id: Date.now(),
                    name: name,
                    price: parseInt(price),
                    category: category,
                    description: description || '',
                    image: imageBase64,
                    date: new Date().toISOString().split('T')[0]
                };
                
                // Save product
                saveProduct(product);
                showNotification('Product added successfully!', 'success');
                
                // Reset form
                addProductForm.reset();
                imagePreview.innerHTML = '';
                
                // Switch to products section
                setTimeout(() => switchSection('products'), 1000);
                
            } catch (error) {
                showNotification('Error saving product', 'error');
                console.error(error);
            }
        });
    }
    
    // Product search
    if (productSearch) {
        productSearch.addEventListener('input', function() {
            loadProducts(this.value);
        });
    }
    
    // Change password form
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPasswordField').value;
            const confirmPassword = document.getElementById('confirmNewPassword').value;
            
            if (currentPassword !== getStoredPassword()) {
                showNotification('Current password is wrong!', 'error');
                return;
            }
            
            if (newPassword.length < 4) {
                showNotification('New password must be at least 4 characters', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            localStorage.setItem('bashanPassword', newPassword);
            showNotification('Password updated successfully!', 'success');
            changePasswordForm.reset();
        });
    }
    
    // Music player events
    if (playBtn) {
        playBtn.addEventListener('click', togglePlayPause);
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            audioPlayer.volume = this.value / 100;
        });
    }
    
    if (uploadSongBtn) {
        uploadSongBtn.addEventListener('click', function() {
            uploadSongSection.style.display = 'block';
        });
    }
    
    if (songUploadArea && songFileInput) {
        songUploadArea.addEventListener('click', () => songFileInput.click());
    }
    
    if (saveSongBtn) {
        saveSongBtn.addEventListener('click', saveSong);
    }
    
    if (cancelUploadBtn) {
        cancelUploadBtn.addEventListener('click', function() {
            uploadSongSection.style.display = 'none';
            resetSongForm();
        });
    }
    
    // Reset statistics
    const resetStatsBtn = document.getElementById('resetStats');
    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all statistics?')) {
                resetStatistics();
                showNotification('Statistics reset successfully', 'success');
            }
        });
    }
    
    // ===== FUNCTIONS =====
    
    function init() {
        // Initialize statistics if not exists
        if (!localStorage.getItem('stats')) {
            resetStatistics();
        }
        
        // Initialize products if not exists
        if (!localStorage.getItem('products')) {
            localStorage.setItem('products', JSON.stringify([]));
        }
        
        // Initialize songs if not exists
        if (!localStorage.getItem('songs')) {
            localStorage.setItem('songs', JSON.stringify([]));
        }
        
        // Load initial data
        updateStatistics();
        loadProducts();
        loadSongs();
    }
    
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('bashanLoggedIn') === 'true';
        if (isLoggedIn) {
            showAdminDashboard();
        } else {
            showLoginScreen();
        }
    }
    
    function showLoginScreen() {
        loginScreen.style.display = 'flex';
        adminDashboard.style.display = 'none';
    }
    
    function showAdminDashboard() {
        loginScreen.style.display = 'none';
        adminDashboard.style.display = 'flex';
        updateStatistics();
        loadProducts();
        loadSongs();
    }
    
    function logout() {
        localStorage.removeItem('bashanLoggedIn');
        showLoginScreen();
        showNotification('Logged out successfully', 'success');
    }
    
    function switchSection(section) {
        // Hide all sections
        contentSections.forEach(sec => {
            sec.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(section + 'Section');
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Update page title
            const sectionTitles = {
                'dashboard': 'Dashboard',
                'products': 'Products',
                'add': 'Add Product',
                'stats': 'Statistics',
                'music': 'Music Player',
                'password': 'Change Password'
            };
            
            if (sectionTitles[section]) {
                pageTitle.textContent = sectionTitles[section];
            }
            
            // Load data for specific sections
            if (section === 'products') {
                loadProducts();
            } else if (section === 'stats') {
                updateStatistics();
            } else if (section === 'music') {
                loadSongs();
            }
        }
    }
    
    function getStoredPassword() {
        return localStorage.getItem('bashanPassword') || DEFAULT_PASSWORD;
    }
    
    function updateTime() {
        const now = new Date();
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
    }
    
    function updateStatistics() {
        // Get statistics from localStorage
        const stats = JSON.parse(localStorage.getItem('stats') || '{}');
        
        // Update dashboard stats
        if (totalOrdersEl) totalOrdersEl.textContent = stats.todayOrders || 0;
        if (totalProductsEl) totalProductsEl.textContent = getTotalProducts();
        if (totalRevenueEl) totalRevenueEl.textContent = 'Ksh ' + (stats.totalRevenue || 0).toLocaleString();
        if (totalVisitsEl) totalVisitsEl.textContent = stats.totalVisits || 0;
        
        // Update analytics stats
        if (whatsappClicksEl) whatsappClicksEl.textContent = stats.whatsappClicks || 0;
        if (smsClicksEl) smsClicksEl.textContent = stats.smsClicks || 0;
        if (callClicksEl) callClicksEl.textContent = stats.callClicks || 0;
        if (todayOrdersEl) todayOrdersEl.textContent = stats.todayOrders || 0;
        if (todayVisitorsEl) todayVisitorsEl.textContent = stats.todayVisitors || 0;
        if (weekVisitorsEl) weekVisitorsEl.textContent = stats.weekVisitors || 0;
        if (monthVisitorsEl) monthVisitorsEl.textContent = stats.monthVisitors || 0;
        if (totalVisitorsCountEl) totalVisitorsCountEl.textContent = stats.totalVisits || 0;
        
        // Update notification count
        const totalOrders = (stats.whatsappClicks || 0) + (stats.smsClicks || 0) + (stats.callClicks || 0);
        if (notificationCount) {
            notificationCount.textContent = totalOrders > 99 ? '99+' : totalOrders;
        }
    }
    
    function getTotalProducts() {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        return products.length;
    }
    
    function resetStatistics() {
        const stats = {
            whatsappClicks: 0,
            smsClicks: 0,
            callClicks: 0,
            todayOrders: 0,
            todayVisitors: 0,
            weekVisitors: 0,
            monthVisitors: 0,
            totalVisits: 0,
            totalRevenue: 0
        };
        localStorage.setItem('stats', JSON.stringify(stats));
        updateStatistics();
    }
    
    async function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    function saveProduct(product) {
        let products = JSON.parse(localStorage.getItem('products') || '[]');
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        
        // Update revenue in stats
        const stats = JSON.parse(localStorage.getItem('stats') || '{}');
        stats.totalRevenue = (stats.totalRevenue || 0) + product.price;
        localStorage.setItem('stats', JSON.stringify(stats));
        
        // Update product count
        updateStatistics();
    }
    
    function loadProducts(searchTerm = '') {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        if (!productsList) return;
        
        if (products.length === 0) {
            productsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>No Products Yet</h3>
                    <p>Add your first product to get started</p>
                    <button class="action-btn" data-section="add">
                        <i class="fas fa-plus"></i>
                        Add First Product
                    </button>
                </div>
            `;
            return;
        }
        
        // Filter products if search term provided
        let filteredProducts = products;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredProducts = products.filter(p => 
                p.name.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term)
            );
        }
        
        // Display products
        let html = '';
        filteredProducts.forEach(product => {
            html += `
                <div class="product-item" style="border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 15px; display: flex; align-items: center; gap: 15px;">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">` : 
                    `<div style="width: 80px; height: 80px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-image" style="color: #ccc; font-size: 24px;"></i>
                    </div>`}
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; color: #333;">${product.name}</h4>
                        <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">
                            <strong>Ksh ${product.price.toLocaleString()}</strong> • ${product.category}
                        </p>
                        ${product.description ? `<p style="margin: 0; color: #888; font-size: 13px;">${product.description}</p>` : ''}
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="editProduct(${product.id})" style="padding: 8px 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteProduct(${product.id})" style="padding: 8px 12px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        productsList.innerHTML = html;
    }
    
    function loadSongs() {
        const songs = JSON.parse(localStorage.getItem('songs') || '[]');
        
        if (!songsContainer) return;
        
        if (songs.length === 0) {
            songsContainer.innerHTML = `
                <div class="empty-songs">
                    <i class="fas fa-music"></i>
                    <p>No songs uploaded yet</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        songs.forEach((song, index) => {
            html += `
                <div class="song-item" style="border: 1px solid #eee; border-radius: 8px; padding: 12px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-music" style="color: #F6B17A;"></i>
                        <div>
                            <div style="font-weight: 500; color: #333;">${song.title}</div>
                            <div style="font-size: 12px; color: #666;">${song.artist}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="playSong(${index})" style="padding: 6px 10px; background: #F6B17A; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-play"></i>
                        </button>
                        <button onclick="deleteSong(${index})" style="padding: 6px 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        songsContainer.innerHTML = html;
    }
    
    function saveSong() {
        const file = songFileInput.files[0];
        const title = document.getElementById('songTitle').value;
        const artist = document.getElementById('songArtistInput').value;
        
        if (!file || !title || !artist) {
            showNotification('Please fill all fields', 'error');
            return;
        }
        
        if (!file.type.startsWith('audio/')) {
            showNotification('Please upload an audio file', 'error');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            showNotification('File too large (max 10MB)', 'error');
            return;
        }
        
        // Convert to base64
        const reader = new FileReader();
        reader.onload = function(e) {
            const songs = JSON.parse(localStorage.getItem('songs') || '[]');
            
            songs.push({
                title: title,
                artist: artist,
                data: e.target.result,
                type: file.type
            });
            
            localStorage.setItem('songs', JSON.stringify(songs));
            
            showNotification('Song uploaded successfully!', 'success');
            resetSongForm();
            uploadSongSection.style.display = 'none';
            loadSongs();
        };
        
        reader.readAsDataURL(file);
    }
    
    function resetSongForm() {
        if (songFileInput) songFileInput.value = '';
        const songTitle = document.getElementById('songTitle');
        const songArtistInput = document.getElementById('songArtistInput');
        if (songTitle) songTitle.value = '';
        if (songArtistInput) songArtistInput.value = '';
    }
    
    function togglePlayPause() {
        if (audioPlayer.paused) {
            playSong(0); // Play first song if none playing
        } else {
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
            updatePlayButton();
        }
    }
    
    function updatePlayButton() {
        if (playBtn) {
            playBtn.innerHTML = audioPlayer.paused ? 
                '<i class="fas fa-play"></i>' : 
                '<i class="fas fa-pause"></i>';
        }
    }
    
    function showNotification(message, type = 'success') {
        if (notificationToast && toastMessage) {
            toastMessage.textContent = message;
            
            // Set icon based on type
            const icon = notificationToast.querySelector('i');
            if (icon) {
                icon.className = type === 'success' ? 
                    'fas fa-check-circle' : 
                    'fas fa-exclamation-circle';
                icon.style.color = type === 'success' ? '#4CAF50' : '#f44336';
            }
            
            notificationToast.classList.add('show');
            
            // Hide after 3 seconds
            setTimeout(() => {
                notificationToast.classList.remove('show');
            }, 3000);
        }
    }
    
    // Make functions available globally
    window.clearImagePreview = function() {
        if (imagePreview) imagePreview.innerHTML = '';
        if (productImageInput) productImageInput.value = '';
    };
    
    window.editProduct = function(productId) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        // Switch to add section and fill form
        switchSection('add');
        
        setTimeout(() => {
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDescription').value = product.description || '';
            
            if (product.image) {
                imagePreview.innerHTML = `
                    <img src="${product.image}" alt="Preview" style="max-width: 100%; border-radius: 8px;">
                    <button type="button" onclick="clearImagePreview()" style="margin-top: 10px; padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Remove Image
                    </button>
                `;
            }
            
            // Change form to edit mode
            const submitBtn = addProductForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
            submitBtn.onclick = function(e) {
                e.preventDefault();
                
                // Update product
                const index = products.findIndex(p => p.id === productId);
                if (index !== -1) {
                    products[index].name = document.getElementById('productName').value;
                    products[index].price = document.getElementById('productPrice').value;
                    products[index].category = document.getElementById('productCategory').value;
                    products[index].description = document.getElementById('productDescription').value;
                    
                    // Update image if changed
                    const newImage = productImageInput.files[0];
                    if (newImage) {
                        fileToBase64(newImage).then(base64 => {
                            products[index].image = base64;
                            localStorage.setItem('products', JSON.stringify(products));
                            showNotification('Product updated!', 'success');
                            switchSection('products');
                        });
                    } else {
                        localStorage.setItem('products', JSON.stringify(products));
                        showNotification('Product updated!', 'success');
                        switchSection('products');
                    }
                }
            };
        }, 100);
    };
    
    window.deleteProduct = function(productId) {
        if (confirm('Delete this product?')) {
            let products = JSON.parse(localStorage.getItem('products') || '[]');
            products = products.filter(p => p.id !== productId);
            localStorage.setItem('products', JSON.stringify(products));
            showNotification('Product deleted', 'success');
            loadProducts();
        }
    };
    
    window.playSong = function(index) {
        const songs = JSON.parse(localStorage.getItem('songs') || '[]');
        if (index >= 0 && index < songs.length) {
            const song = songs[index];
            audioPlayer.src = song.data;
            audioPlayer.type = song.type;
            
            if (currentSongEl) currentSongEl.textContent = song.title;
            if (songArtistEl) songArtistEl.textContent = song.artist;
            if (miniPlayer) {
                miniPlayer.innerHTML = `
                    <i class="fas fa-pause"></i>
                    <span>${song.title}</span>
                `;
            }
            
            audioPlayer.play();
            updatePlayButton();
        }
    };
    
    window.deleteSong = function(index) {
        if (confirm('Delete this song?')) {
            const songs = JSON.parse(localStorage.getItem('songs') || '[]');
            songs.splice(index, 1);
            localStorage.setItem('songs', JSON.stringify(songs));
            showNotification('Song deleted', 'success');
            loadSongs();
        }
    };
    
    // Audio player events
    audioPlayer.addEventListener('play', updatePlayButton);
    audioPlayer.addEventListener('pause', updatePlayButton);
    audioPlayer.addEventListener('ended', function() {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
});

// Initialize main website tracking
if (typeof window !== 'undefined') {
    // Track website visits
    let stats = JSON.parse(localStorage.getItem('stats') || '{}');
    const today = new Date().toDateString();
    
    if (!stats.lastVisit || stats.lastVisit !== today) {
        stats.todayVisitors = (stats.todayVisitors || 0) + 1;
        stats.weekVisitors = (stats.weekVisitors || 0) + 1;
        stats.monthVisitors = (stats.monthVisitors || 0) + 1;
        stats.totalVisits = (stats.totalVisits || 0) + 1;
        stats.lastVisit = today;
        localStorage.setItem('stats', JSON.stringify(stats));
    }
    
    // Track order button clicks (for main website)
    document.addEventListener('click', function(e) {
        let target = e.target;
        
        // Check if clicked element or its parent is an order button
        while (target && target !== document) {
            if (target.href) {
                if (target.href.includes('whatsapp')) {
                    updateClickCount('whatsappClicks');
                    break;
                } else if (target.href.includes('sms')) {
                    updateClickCount('smsClicks');
                    break;
                } else if (target.href.includes('tel:')) {
                    updateClickCount('callClicks');
                    break;
                }
            }
            target = target.parentElement;
        }
    });
    
    function updateClickCount(type) {
        let stats = JSON.parse(localStorage.getItem('stats') || '{}');
        stats[type] = (stats[type] || 0) + 1;
        stats.todayOrders = (stats.todayOrders || 0) + 1;
        localStorage.setItem('stats', JSON.stringify(stats));
    }
}