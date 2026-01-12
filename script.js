// Modern Script for Bashan Locs & Fashion
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Category Filtering
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productsContainer = document.getElementById('productsContainer');
    
    // Load products
    loadProducts();
    
    // Filter products
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterProducts(filter);
        });
    });
    
    // Glitter cursor effect
    createGlitterCursor();
    
    // Back to top button
    createBackToTopButton();
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('.newsletter-input').value;
            
            if (validateEmail(email)) {
                showNotification('Success! You have subscribed to our newsletter.', 'success');
                this.reset();
                
                // Store in localStorage
                const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
                subscribers.push({
                    email: email,
                    date: new Date().toISOString()
                });
                localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
    
    // Initialize product quick view modal
    initProductModal();
    
    // Animate elements on scroll
    initScrollAnimations();
    
    // Initialize WhatsApp floating button
    initWhatsAppButton();
    
    // Functions
    async function loadProducts() {
        try {
            // Try to load from localStorage first
            let products = JSON.parse(localStorage.getItem('mainSiteProducts') || '[]');
            
            // If no products in localStorage, try products.json
            if (products.length === 0) {
                const response = await fetch('products.json');
                products = await response.json();
            }
            
            displayProducts(products);
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to sample products
            const sampleProducts = getSampleProducts();
            displayProducts(sampleProducts);
        }
    }
    
    function displayProducts(products) {
        if (!productsContainer) return;
        
        if (products.length === 0) {
            productsContainer.innerHTML = `
                <div class="empty-products">
                    <i class="fas fa-box-open"></i>
                    <h3>Coming Soon!</h3>
                    <p>New arrivals will be available soon. Check back later!</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        products.forEach(product => {
            const categoryNames = {
                'fashion': '👑 Elegance Collection',
                'shoes': '👠 Footwear Boutique',
                'bags': '👜 Handbag Atelier',
                'jewelry': '💎 Finery Gallery',
                'perfumes': '🌸 Signature Scents',
                'oils': '⚗️ Beauty Elixirs',
                'hair': '💇 Tresses Collection'
            };
            
            // WhatsApp message template
            const whatsappMessage = encodeURIComponent(
                `Hello Bashan Locs! I am interested in "${product.name}" (Ksh ${product.price.toLocaleString()}) from your website. My name is [Your Name].`
            );
            
            // SMS message template
            const smsMessage = encodeURIComponent(
                `Interested in ${product.name} (Ksh ${product.price.toLocaleString()}). My name is [Your Name].`
            );
            
            html += `
                <div class="product-card" data-category="${product.category}">
                    <div class="product-image-container">
                        <img src="${product.image || 'assets/placeholder.jpg'}" 
                             alt="${product.name}" 
                             class="product-image"
                             onerror="this.src='assets/placeholder.jpg'">
                        <div class="product-overlay">
                            <button class="quick-view-btn" data-product-id="${product.id}">
                                <i class="fas fa-eye"></i> Quick View
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <span class="product-category">${categoryNames[product.category] || product.category}</span>
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price">Ksh ${product.price.toLocaleString()}</div>
                        <div class="product-actions">
                            <a href="https://wa.me/254705902289?text=${whatsappMessage}" 
                               class="product-btn whatsapp" target="_blank">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </a>
                            <a href="sms:+254705902289?body=${smsMessage}" 
                               class="product-btn sms" target="_blank">
                                <i class="fas fa-comment-alt"></i> SMS
                            </a>
                            <a href="tel:+254705902289" 
                               class="product-btn call" target="_blank">
                                <i class="fas fa-phone"></i> Call
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsContainer.innerHTML = html;
        
        // Add event listeners to quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.dataset.productId;
                showProductModal(productId);
            });
        });
    }
    
    function filterProducts(filter) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            if (filter === 'all' || product.dataset.category === filter) {
                product.style.display = 'block';
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 10);
            } else {
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    product.style.display = 'none';
                }, 300);
            }
        });
    }
    
    function createGlitterCursor() {
        document.addEventListener('mousemove', function(e) {
            if (Math.random() > 0.9) {
                const glitter = document.createElement('div');
                glitter.className = 'cursor-glitter';
                glitter.style.left = e.pageX + 'px';
                glitter.style.top = e.pageY + 'px';
                
                const size = Math.random() * 8 + 4;
                glitter.style.width = size + 'px';
                glitter.style.height = size + 'px';
                glitter.style.background = Math.random() > 0.5 ? 'var(--gold)' : 'var(--pink)';
                
                document.body.appendChild(glitter);
                
                setTimeout(() => {
                    if (glitter.parentNode) {
                        glitter.parentNode.removeChild(glitter);
                    }
                }, 1000);
            }
        });
        
        // Add CSS for glitter
        const style = document.createElement('style');
        style.textContent = `
            .cursor-glitter {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0.7;
                animation: glitterFall 1s ease-out forwards;
            }
            
            @keyframes glitterFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.7;
                }
                100% {
                    transform: translateY(100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    function createBackToTopButton() {
        const button = document.createElement('div');
        button.className = 'back-to-top';
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.body.appendChild(button);
        
        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide button on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Add notification styles
        if (!document.querySelector('.notification-styles')) {
            const style = document.createElement('style');
            style.className = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                    max-width: 350px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                }
                
                .notification-success {
                    background: rgba(76, 175, 80, 0.9);
                    color: white;
                    border: 1px solid #4CAF50;
                }
                
                .notification-error {
                    background: rgba(244, 67, 54, 0.9);
                    color: white;
                    border: 1px solid #F44336;
                }
                
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
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    function initProductModal() {
        // Modal will be created dynamically
    }
    
    function showProductModal(productId) {
        // This would show a modal with product details
        // For now, we'll show a simple alert
        const products = JSON.parse(localStorage.getItem('mainSiteProducts') || '[]');
        const product = products.find(p => p.id == productId);
        
        if (product) {
            const whatsappMessage = encodeURIComponent(
                `Hello Bashan Locs! I am interested in "${product.name}" (Ksh ${product.price.toLocaleString()}) from your website. My name is [Your Name].`
            );
            
            window.open(`https://wa.me/254705902289?text=${whatsappMessage}`, '_blank');
        }
    }
    
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements you want to animate
        document.querySelectorAll('.category-card, .product-card, .step').forEach(el => {
            observer.observe(el);
        });
    }
    
    function initWhatsAppButton() {
        // WhatsApp floating button is already in HTML
        // We'll just add a click counter
        const whatsappButtons = document.querySelectorAll('[href*="whatsapp"]');
        whatsappButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const clicks = parseInt(localStorage.getItem('whatsappClicks') || '0');
                localStorage.setItem('whatsappClicks', (clicks + 1).toString());
            });
        });
    }
    
    function getSampleProducts() {
        return [
            {
                id: 1,
                name: "Designer Leather Handbag",
                price: 4500,
                category: "bags",
                image: "assets/products/handbag.jpg"
            },
            {
                id: 2,
                name: "Gold Plated Necklace",
                price: 1200,
                category: "jewelry",
                image: "assets/products/necklace.jpg"
            },
            {
                id: 3,
                name: "Women's Designer Sandals",
                price: 1800,
                category: "shoes",
                image: "assets/products/sandals.jpg"
            },
            {
                id: 4,
                name: "Evening Gown Dress",
                price: 3500,
                category: "fashion",
                image: "assets/products/dress.jpg"
            },
            {
                id: 5,
                name: "Premium Perfume",
                price: 2500,
                category: "perfumes",
                image: "assets/products/perfume.jpg"
            },
            {
                id: 6,
                name: "Hair Extension Set",
                price: 3000,
                category: "hair",
                image: "assets/products/hair.jpg"
            },
            {
                id: 7,
                name: "Bleaching Oil",
                price: 800,
                category: "oils",
                image: "assets/products/oil.jpg"
            },
            {
                id: 8,
                name: "Leather Strap Watch",
                price: 2200,
                category: "jewelry",
                image: "assets/products/watch.jpg"
            }
        ];
    }
    
    // Add animation styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .category-card,
        .product-card,
        .step {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .category-card.animate-in,
        .product-card.animate-in,
        .step.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .empty-products {
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px;
            color: var(--gray-dark);
        }
        
        .empty-products i {
            font-size: 3rem;
            color: var(--gold);
            margin-bottom: 20px;
            opacity: 0.5;
        }
        
        .empty-products h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: var(--white);
        }
        
        .empty-products p {
            font-size: 1rem;
        }
        
        .product-image-container {
            position: relative;
            overflow: hidden;
        }
        
        .product-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: var(--transition);
        }
        
        .product-card:hover .product-overlay {
            opacity: 1;
        }
        
        .quick-view-btn {
            background: var(--gold);
            color: var(--black);
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .quick-view-btn:hover {
            background: var(--gold-light);
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(animationStyle);
});

// Make functions available globally
window.switchSection = function(section) {
    const sections = document.querySelectorAll('.dashboard-section');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Hide all sections
    sections.forEach(sec => sec.classList.remove('active'));
    
    // Show selected section
    document.getElementById(section + 'Section').classList.add('active');
    
    // Update active nav item
    navItems.forEach(item => {
        if (item.dataset.section === section) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
};

window.clearImage = function() {
    const imagePreview = document.getElementById('imagePreview');
    const productImageInput = document.getElementById('productImage');
    
    if (imagePreview && productImageInput) {
        imagePreview.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-image"></i>
                <p>Image preview will appear here</p>
            </div>
        `;
        productImageInput.value = '';
    }
};

window.editProduct = function(productId) {
    // In a full implementation, this would open an edit form
    alert('Edit functionality would open for product ID: ' + productId);
};

window.deleteProduct = function(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem('bashanProducts') || '[]');
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('bashanProducts', JSON.stringify(products));
        
        // Update main site
        updateMainSiteProducts();
        
        // Reload products
        const searchProduct = document.getElementById('searchProduct');
        loadProductsForManagement(searchProduct ? searchProduct.value : '');
        
        // Show message
        const message = document.getElementById('manageMessage');
        message.className = 'message message-success';
        message.innerHTML = '<i class="fas fa-check-circle"></i> Product deleted successfully!';
        
        setTimeout(() => {
            message.className = 'message';
        }, 3000);
    }
};

function updateMainSiteProducts() {
    const products = JSON.parse(localStorage.getItem('bashanProducts') || '[]');
    const mainSiteProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image
    }));
    
    localStorage.setItem('mainSiteProducts', JSON.stringify(mainSiteProducts));
}

function loadProductsForManagement(searchTerm = '') {
    // This function should be in admin.js
    console.log('Loading products for management...');
}

// Add this at the beginning of your existing script.js file:

// SEO & Analytics Tracking
document.addEventListener('DOMContentLoaded', function() {
    // Track page views
    trackPageView();
    
    // Track button clicks for analytics
    setupAnalytics();
    
    // Structured data for rich snippets
    injectStructuredData();
});

function trackPageView() {
    // Get or create stats
    let stats = JSON.parse(localStorage.getItem('websiteStats') || '{}');
    
    // Today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Initialize today's data if not exists
    if (!stats[today]) {
        stats[today] = {
            views: 0,
            orders: 0,
            uniqueVisitors: 0
        };
    }
    
    // Increment views
    stats[today].views++;
    
    // Check if unique visitor (using session)
    const sessionKey = 'bashan_visitor_session';
    if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, 'true');
        stats[today].uniqueVisitors++;
    }
    
    // Save stats
    localStorage.setItem('websiteStats', JSON.stringify(stats));
}

function setupAnalytics() {
    // Track all order button clicks
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Check for WhatsApp buttons
        if (target.closest('[href*="whatsapp"]')) {
            trackEvent('whatsapp_click');
        }
        
        // Check for SMS buttons
        if (target.closest('[href*="sms"]')) {
            trackEvent('sms_click');
        }
        
        // Check for Call buttons
        if (target.closest('[href*="tel:"]')) {
            trackEvent('call_click');
        }
        
        // Check for booking buttons
        if (target.closest('[href*="book"]') || target.closest('[href*="appointment"]')) {
            trackEvent('booking_click');
        }
    });
}

function trackEvent(eventName) {
    let events = JSON.parse(localStorage.getItem('websiteEvents') || '{}');
    
    if (!events[eventName]) {
        events[eventName] = 0;
    }
    
    events[eventName]++;
    localStorage.setItem('websiteEvents', JSON.stringify(events));
    
    // Also update daily stats
    const today = new Date().toISOString().split('T')[0];
    let stats = JSON.parse(localStorage.getItem('websiteStats') || '{}');
    
    if (!stats[today]) {
        stats[today] = { views: 0, orders: 0, uniqueVisitors: 0 };
    }
    
    if (eventName.includes('click')) {
        stats[today].orders++;
    }
    
    localStorage.setItem('websiteStats', JSON.stringify(stats));
}

function injectStructuredData() {
    // Product schema data
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };
    
    // This will be populated when products load
    // The schema helps Google understand your products
}

// Add this function to update structured data when products load
function updateProductSchema(products) {
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    
    const productListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": product.name,
                "description": product.description || "Premium fashion item from Bashan Locs & Fashion",
                "offers": {
                    "@type": "Offer",
                    "price": product.price,
                    "priceCurrency": "KES",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "Bashan Locs & Fashion"
                    }
                }
            }
        }))
    };
    
    schemaScript.textContent = JSON.stringify(productListSchema);
    document.head.appendChild(schemaScript);
}