// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elementleri
    const loginContainer = document.getElementById('loginContainer');
    const adminContainer = document.getElementById('adminContainer');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminSections = document.querySelectorAll('.admin-section');
    const announcementForm = document.getElementById('announcementForm');
    const productForm = document.getElementById('productForm');
    const announcementsTable = document.getElementById('announcementsTable');
    const productsTable = document.getElementById('productsTable');
    const adminReviewsList = document.getElementById('adminReviewsList');

    // Admin bilgileri
    const ADMIN_EMAIL = 'hamitcanaktas5@gmail.com';
    const ADMIN_PASSWORD = 'hamitcan3124';

    // Giriş durumunu kontrol et
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
        loadAdminData();
    }

    // Giriş formu
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminEmail', email);
            showAdminPanel();
            loadAdminData();
            showMessage('Başarılı giriş!', 'success');
        } else {
            showMessage('Hatalı e-posta veya şifre!', 'error');
        }
    });

    // Çıkış butonu
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
        showLoginPanel();
        showMessage('Başarıyla çıkış yapıldı', 'info');
    });

    // Admin panelini göster
    function showAdminPanel() {
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'flex';
    }

    // Giriş panelini göster
    function showLoginPanel() {
        loginContainer.style.display = 'flex';
        adminContainer.style.display = 'none';
    }

    // Mesaj göster
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `admin-message admin-message-${type}`;
        messageDiv.textContent = message;
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Admin verilerini yükle
    function loadAdminData() {
        loadAnnouncements();
        loadProducts();
        loadReviews();
        updateStats();
    }

    // Duyuruları yükle
    function loadAnnouncements() {
        const announcements = getAnnouncements();
        
        if (!announcementsTable) return;
        
        announcementsTable.innerHTML = '';
        
        if (announcements.length === 0) {
            announcementsTable.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; padding: 30px;">
                        Henüz duyuru eklenmemiş.
                    </td>
                </tr>
            `;
            return;
        }
        
        announcements.forEach(announcement => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${announcement.title}</td>
                <td>${announcement.date}</td>
                <td>
                    <button class="action-btn btn-delete" onclick="deleteAnnouncement(${announcement.id})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </td>
            `;
            announcementsTable.appendChild(row);
        });
    }

    // İlanları yükle
    function loadProducts() {
        const products = getProducts();
        
        if (!productsTable) return;
        
        productsTable.innerHTML = '';
        
        if (products.length === 0) {
            productsTable.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 30px;">
                        Henüz ilan eklenmemiş.
                    </td>
                </tr>
            `;
            return;
        }
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category === 'virtual-numbers' ? 'Sanal Numaralar' : 'Sosyal Medya'}</td>
                <td>${product.price}₺</td>
                <td>
                    <button class="action-btn btn-reply" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Düzenle
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </td>
            `;
            productsTable.appendChild(row);
        });
    }

    // Değerlendirmeleri yükle
    function loadReviews() {
        const reviews = getReviews();
        
        if (!adminReviewsList) return;
        
        adminReviewsList.innerHTML = '';
        
        if (reviews.length === 0) {
            adminReviewsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>Henüz değerlendirme bulunmamaktadır.</p>
                </div>
            `;
            return;
        }
        
        reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            let replySection = '';
            if (review.reply) {
                replySection = `
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px;">
                        <strong>Yanıtınız:</strong> ${review.reply}
                    </div>
                `;
            }
            
            reviewItem.innerHTML = `
                <div class="review-header">
                    <div class="reviewer-name">${review.name}</div>
                    <div class="review-date">${review.date}</div>
                </div>
                <div>${review.content}</div>
                ${replySection}
                <div class="review-actions">
                    <button class="action-btn btn-reply" onclick="replyToReview(${review.id})">
                        <i class="fas fa-reply"></i> Yanıtla
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteReview(${review.id})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </div>
            `;
            
            adminReviewsList.appendChild(reviewItem);
        });
    }

    // İstatistikleri güncelle
    function updateStats() {
        const products = getProducts();
        const reviews = getReviews();
        const announcements = getAnnouncements();
        
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalReviews').textContent = reviews.length;
        document.getElementById('activeAnnouncements').textContent = announcements.length;
    }

    // Duyuru ekleme
    if (announcementForm) {
        announcementForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const announcement = {
                id: Date.now(),
                title: document.getElementById('announcementTitle').value,
                content: document.getElementById('announcementContent').value,
                type: document.getElementById('announcementType').value,
                date: new Date().toLocaleDateString('tr-TR')
            };
            
            saveAnnouncement(announcement);
            announcementForm.reset();
            loadAnnouncements();
            updateStats();
            showMessage('Duyuru başarıyla eklendi!', 'success');
        });
    }

    // İlan ekleme
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const product = {
                id: Date.now(),
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                price: parseInt(document.getElementById('productPrice').value),
                status: document.getElementById('productStatus').value,
                description: document.getElementById('productDescription').value,
                features: []
            };
            
            saveProduct(product);
            productForm.reset();
            loadProducts();
            updateStats();
            showMessage('İlan başarıyla eklendi!', 'success');
        });
    }

    // LocalStorage fonksiyonları
    function getAnnouncements() {
        return JSON.parse(localStorage.getItem('roxyAnnouncements') || '[]');
    }

    function saveAnnouncement(announcement) {
        const announcements = getAnnouncements();
        announcements.push(announcement);
        localStorage.setItem('roxyAnnouncements', JSON.stringify(announcements));
    }

    function deleteAnnouncement(id) {
        if (!confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return;
        
        let announcements = getAnnouncements();
        announcements = announcements.filter(a => a.id !== id);
        localStorage.setItem('roxyAnnouncements', JSON.stringify(announcements));
        loadAnnouncements();
        updateStats();
        showMessage('Duyuru başarıyla silindi!', 'success');
    }

    function getProducts() {
        return JSON.parse(localStorage.getItem('roxyProducts') || '[]');
    }

    function saveProduct(product) {
        const products = getProducts();
        products.push(product);
        localStorage.setItem('roxyProducts', JSON.stringify(products));
    }

    function deleteProduct(id) {
        if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
        
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        localStorage.setItem('roxyProducts', JSON.stringify(products));
        loadProducts();
        updateStats();
        showMessage('İlan başarıyla silindi!', 'success');
    }

    function getReviews() {
        return JSON.parse(localStorage.getItem('roxyStoreReviews') || '[]');
    }

    function deleteReview(id) {
        if (!confirm('Bu değerlendirmeyi silmek istediğinize emin misiniz?')) return;
        
        let reviews = getReviews();
        reviews = reviews.filter(r => r.id !== id);
        localStorage.setItem('roxyStoreReviews', JSON.stringify(reviews));
        loadReviews();
        updateStats();
        showMessage('Değerlendirme başarıyla silindi!', 'success');
    }

    // Global fonksiyonlar
    window.editProduct = function(id) {
        const products = getProducts();
        const product = products.find(p => p.id === id);
        
        if (!product) return;
        
        const newName = prompt('Yeni ilan adı:', product.name);
        if (newName) {
            product.name = newName;
            const newPrice = prompt('Yeni fiyat:', product.price);
            if (newPrice) {
                product.price = parseInt(newPrice);
            }
            
            localStorage.setItem('roxyProducts', JSON.stringify(products));
            loadProducts();
            showMessage('İlan başarıyla güncellendi!', 'success');
        }
    };

    window.replyToReview = function(id) {
        const reviews = getReviews();
        const review = reviews.find(r => r.id === id);
        
        if (!review) return;
        
        const reply = prompt(`${review.name} adlı kullanıcının değerlendirmesine yanıt verin:`, review.reply || '');
        if (reply !== null) {
            review.reply = reply;
            localStorage.setItem('roxyStoreReviews', JSON.stringify(reviews));
            loadReviews();
            showMessage('Yanıt başarıyla gönderildi!', 'success');
        }
    };

    window.deleteAnnouncement = deleteAnnouncement;
    window.deleteProduct = deleteProduct;
    window.deleteReview = deleteReview;

    // Örnek verileri yükle
    function initializeSampleData() {
        if (getProducts().length === 0) {
            const sampleProducts = [
                {
                    id: 1,
                    name: 'WhatsApp Global Numara',
                    category: 'virtual-numbers',
                    price: 250,
                    status: 'active',
                    description: 'Global WhatsApp numarası',
                    features: []
                },
                {
                    id: 2,
                    name: 'Instagram 1.000 Takipçi',
                    category: 'social-media',
                    price: 100,
                    status: 'active',
                    description: 'Gerçek ve aktif takipçiler',
                    features: []
                }
            ];
            
            sampleProducts.forEach(product => saveProduct(product));
        }
        
        if (getAnnouncements().length === 0) {
            const sampleAnnouncement = {
                id: 1,
                title: 'Hoş Geldiniz!',
                content: 'ROXY STORE Admin paneline hoş geldiniz.',
                type: 'info',
                date: new Date().toLocaleDateString('tr-TR')
            };
            
            saveAnnouncement(sampleAnnouncement);
        }
    }

    // Örnek verileri başlat
    initializeSampleData();
});