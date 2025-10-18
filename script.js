// Toggle tema gelap/terang
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Cek preferensi tema yang disimpan
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

// Toggle tema saat tombol diklik
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update ikon tema
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
    } else {
        themeIcon.className = 'fas fa-sun';
    }
}

// Toggle menu mobile
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // Toggle icon menu
    if (navMenu.classList.contains('active')) {
        mobileMenuBtn.innerHTML = '✕';
    } else {
        mobileMenuBtn.innerHTML = '☰';
    }
});

// Tutup menu mobile saat mengklik link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '☰';
    });
});

// Tutup menu mobile saat mengklik di luar
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn') && !e.target.closest('.theme-toggle')) {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '☰';
    }
});

// Animasi fade-in saat scroll
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInOnScroll = () => {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
};

// Panggil saat halaman dimuat dan saat di-scroll
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', fadeInOnScroll);

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Tutup semua item FAQ lainnya
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });
        
        // Buka item yang diklik jika sebelumnya tidak aktif
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Animasi Scroll Simulasi dengan Loading Indicator Navbar
class ScrollSimulator {
    constructor() {
        this.isScrolling = false;
        this.scrollDuration = 1500;
        this.easing = this.easeInOutCubic;
        this.navLoading = this.createNavLoading();
        this.init();
    }

    init() {
        this.bindNavLinks();
        this.setupNavLoading();
    }

    createNavLoading() {
        const loading = document.createElement('div');
        loading.className = 'nav-loading';
        document.querySelector('header').appendChild(loading);
        return loading;
    }

    setupNavLoading() {
        // Tambahkan event listener untuk semua nav items
        document.querySelectorAll('.nav-menu a, .hero-buttons .btn').forEach(element => {
            element.addEventListener('click', (e) => {
                if (element.getAttribute('href')?.startsWith('#')) {
                    this.showNavLoading(element);
                }
            });
        });
    }

    showNavLoading(clickedElement) {
        // Reset semua loading states
        this.hideNavLoading();
        
        // Tampilkan loading indicator di navbar
        this.navLoading.classList.add('active');
        
        // Tambahkan loading state pada elemen yang diklik
        if (clickedElement.classList.contains('nav-menu')) {
            clickedElement.classList.add('loading');
        } else if (clickedElement.classList.contains('btn')) {
            clickedElement.classList.add('loading');
            
            // Simpan teks asli dan ganti dengan loading
            const originalText = clickedElement.innerHTML;
            clickedElement.setAttribute('data-original-text', originalText);
            clickedElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
        
        // Wave effect untuk nav items
        if (clickedElement.classList.contains('nav-menu')) {
            clickedElement.classList.add('wave');
            setTimeout(() => {
                clickedElement.classList.remove('wave');
            }, 600);
        }
    }

    hideNavLoading() {
        // Sembunyikan loading indicator
        this.navLoading.classList.remove('active');
        
        // Hapus semua loading states
        document.querySelectorAll('.nav-menu a.loading, .btn.loading').forEach(element => {
            element.classList.remove('loading');
            
            // Kembalikan teks asli untuk tombol
            const originalText = element.getAttribute('data-original-text');
            if (originalText) {
                element.innerHTML = originalText;
                element.removeAttribute('data-original-text');
            }
        });
    }

    bindNavLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement && !this.isScrolling) {
                    this.simulateNaturalScroll(targetElement, anchor);
                }
            });
        });
    }

    simulateNaturalScroll(targetElement, clickedElement = null) {
        if (this.isScrolling) return;

        this.isScrolling = true;
        
        // Tampilkan loading indicator
        if (clickedElement) {
            this.showNavLoading(clickedElement);
        }
        
        // Tutup menu mobile jika terbuka
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '☰';

        const startPosition = window.pageYOffset;
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + startPosition - headerHeight;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        // Efek visual selama scroll
        this.addScrollEffects(targetElement);

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.scrollDuration, 1);
            const easeProgress = this.easing(progress);

            window.scrollTo(0, startPosition + (distance * easeProgress));

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                this.isScrolling = false;
                this.removeScrollEffects();
                this.hideNavLoading();
                
                // Highlight target section
                this.highlightTargetSection(targetElement);
                
                // Trigger fade-in animations setelah scroll selesai
                setTimeout(() => {
                    fadeInOnScroll();
                }, 100);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    // Easing function untuk efek natural
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Tambahkan efek visual selama scroll simulasi
    addScrollEffects(targetElement) {
        document.body.classList.add('simulated-scrolling');
        
        // Tampilkan global loading indicator
        const scrollLoading = document.querySelector('.scroll-loading');
        if (scrollLoading) {
            scrollLoading.style.display = 'flex';
            scrollLoading.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menuju ${targetElement.id || 'section'}...`;
        }

        // Efek blur ringan pada konten
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            if (section !== targetElement) {
                section.style.transition = 'filter 0.3s ease';
                section.style.filter = 'blur(2px)';
            }
        });
    }

    removeScrollEffects() {
        document.body.classList.remove('simulated-scrolling');
        
        // Sembunyikan global loading indicator
        const scrollLoading = document.querySelector('.scroll-loading');
        if (scrollLoading) {
            scrollLoading.style.display = 'none';
        }
        
        // Hapus efek blur
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.filter = 'none';
        });
    }

    highlightTargetSection(targetElement) {
        targetElement.classList.add('scroll-target', 'highlight');
        
        setTimeout(() => {
            targetElement.classList.remove('highlight');
        }, 2000);
        
        setTimeout(() => {
            targetElement.classList.remove('scroll-target');
        }, 3000);
    }
}

// Inisialisasi Scroll Simulator
const scrollSimulator = new ScrollSimulator();

// Animasi Scroll Navbar
const header = document.querySelector('header');
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

let lastScrollY = window.scrollY;
let ticking = false;

function updateHeader() {
    const scrollY = window.scrollY;
    
    // Scroll progress bar
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollPercent = (scrollY / (docHeight - winHeight)) * 100;
    scrollProgress.style.width = scrollPercent + '%';
    
    // Navbar scroll effect
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Parallax effect untuk hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// Inisialisasi saat halaman dimuat
window.addEventListener('load', () => {
    updateHeader();
    fadeInOnScroll();
});

// Optimasi untuk touch devices
document.addEventListener('touchstart', function() {}, { passive: true });

// Mencegah zoom pada double tap (untuk mobile)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Protection scripts
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 'x' || e.key === 'u')) {
        e.preventDefault();
    }
    
    if (e.key === 'F12') {
        e.preventDefault();
    }
});

document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});

document.addEventListener('drop', function(e) {
    e.preventDefault();
});

// Animasi tambahan untuk interaksi
document.addEventListener('DOMContentLoaded', function() {
    // Animasi untuk tombol
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animasi untuk kartu
    const cards = document.querySelectorAll('.feature-card, .download-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
});

// ============================ //
// LOGIN SYSTEM DENGAN ANIMASI GENSHIN IMPACT - FIXED
// ============================ //

class LoginSystem {
    constructor() {
        this.modal = document.getElementById('login-modal');
        this.loginForm = document.getElementById('login-form');
        this.loginBtn = this.loginForm.querySelector('.login-btn');
        this.logoutBtn = document.getElementById('logout-btn');
        this.isAnimating = false;
        this.isLoggedIn = localStorage.getItem('pteams-loggedin') === 'true';
        
        this.init();
    }
    
    init() {
        this.createDoorAnimation();
        this.createParticles();
        this.createCloseButton();
        this.bindEvents();
        
        // Cek status login
        if (this.isLoggedIn) {
            this.hideLoginModal();
            this.showLogoutButton();
        } else {
            // Tampilkan modal login saat halaman dimuat
            setTimeout(() => {
                this.showLogin();
            }, 800);
        }
    }
    
    createDoorAnimation() {
        const doorAnimation = document.createElement('div');
        doorAnimation.className = 'door-animation';
        doorAnimation.innerHTML = `
            <div class="door-left"></div>
            <div class="door-right"></div>
            <div class="light-beam"></div>
            <div class="particles"></div>
            <div class="success-animation">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="success-text">Selamat Datang!</div>
            </div>
        `;
        this.modal.querySelector('.login-container').appendChild(doorAnimation);
        
        this.doorLeft = doorAnimation.querySelector('.door-left');
        this.doorRight = doorAnimation.querySelector('.door-right');
        this.lightBeam = doorAnimation.querySelector('.light-beam');
        this.particlesContainer = doorAnimation.querySelector('.particles');
        this.successAnimation = doorAnimation.querySelector('.success-animation');
        this.doorAnimation = doorAnimation;
    }
    
    createCloseButton() {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'login-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', () => {
            if (!this.isLoggedIn) {
                this.showError('Anda harus login untuk mengakses website ini');
            }
        });
        this.modal.querySelector('.login-container').appendChild(closeBtn);
    }
    
    createParticles() {
        // Hapus partikel lama jika ada
        const oldParticles = this.particlesContainer.querySelectorAll('.particle');
        oldParticles.forEach(particle => particle.remove());
        
        // Buat partikel baru
        for (let i = 0; i < 80; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // Random size
            const size = Math.random() * 4 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random animation delay
            const delay = Math.random() * 3;
            const duration = Math.random() * 4 + 2;
            
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            this.particlesContainer.appendChild(particle);
        }
    }
    
    bindEvents() {
        // Form submission
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Register link
        document.getElementById('register-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterMessage();
        });
        
        // Logout button
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
        
        // Prevent closing modal by clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal && !this.isLoggedIn) {
                this.showError('Anda harus login untuk mengakses website ini');
            }
        });
    }
    
    showLogin() {
        this.modal.classList.add('active');
        
        // Reset form
        this.loginForm.reset();
        this.hideError();
        
        // Mulai animasi pintu
        setTimeout(() => {
            this.doorAnimation.classList.add('active');
        }, 300);
        
        // Aktifkan efek cahaya
        setTimeout(() => {
            this.lightBeam.classList.add('active');
        }, 800);
        
        // Animasikan partikel
        setTimeout(() => {
            this.animateParticles();
        }, 1200);
    }
    
    hideLoginModal() {
        this.modal.classList.remove('active');
        this.doorAnimation.classList.remove('active');
        this.lightBeam.classList.remove('active');
        this.hideError();
    }
    
    animateParticles() {
        // Partikel sudah dianimasikan melalui CSS
        // Fungsi ini hanya untuk inisialisasi
    }
    
    async handleLogin() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Tampilkan loading state
        this.loginBtn.classList.add('loading');
        
        // Simulasi proses login
        await this.delay(1800);
        
        // Validasi sederhana
        if (username && password) {
            if (username.length >= 3 && password.length >= 3) {
                await this.successLogin();
            } else {
                this.showError('Username dan password harus minimal 3 karakter');
            }
        } else {
            this.showError('Harap isi semua field!');
        }
        
        this.loginBtn.classList.remove('loading');
        this.isAnimating = false;
    }
    
    async successLogin() {
        // Simpan status login
        localStorage.setItem('pteams-loggedin', 'true');
        localStorage.setItem('pteams-username', document.getElementById('username').value);
        this.isLoggedIn = true;
        
        // Tampilkan animasi sukses
        this.successAnimation.classList.add('active');
        
        // Tunggu sebentar untuk menampilkan animasi sukses
        await this.delay(2200);
        
        // Tutup pintu
        this.doorAnimation.classList.add('exiting');
        this.lightBeam.classList.remove('active');
        this.successAnimation.classList.remove('active');
        
        // Tunggu animasi selesai
        await this.delay(1200);
        
        // Sembunyikan modal
        this.hideLoginModal();
        
        // Tampilkan tombol logout
        this.showLogoutButton();
        
        // Tampilkan welcome message
        this.showWelcomeMessage();
        
        // Reset untuk penggunaan berikutnya
        setTimeout(() => {
            this.doorAnimation.classList.remove('active', 'exiting');
            this.loginForm.reset();
        }, 500);
    }
    
    showLogoutButton() {
        if (this.logoutBtn) {
            this.logoutBtn.style.display = 'block';
            this.logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Keluar`;
        }
    }
    
    hideLogoutButton() {
        if (this.logoutBtn) {
            this.logoutBtn.style.display = 'none';
        }
    }
    
    async handleLogout() {
        // Hapus status login
        localStorage.removeItem('pteams-loggedin');
        localStorage.removeItem('pteams-username');
        this.isLoggedIn = false;
        
        // Sembunyikan tombol logout
        this.hideLogoutButton();
        
        // Tampilkan logout message
        this.showLogoutMessage();
        
        // Tampilkan kembali modal login setelah delay
        setTimeout(() => {
            this.showLogin();
        }, 2000);
    }
    
    showError(message) {
        // Buat atau update elemen error
        let errorElement = this.loginForm.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            this.loginForm.insertBefore(errorElement, this.loginForm.firstChild);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Animasi shake
        errorElement.style.animation = 'none';
        setTimeout(() => {
            errorElement.style.animation = 'shakeError 0.5s ease';
        }, 10);
        
        // Sembunyikan setelah 4 detik
        setTimeout(() => {
            this.hideError();
        }, 4000);
    }
    
    hideError() {
        const errorElement = this.loginForm.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    showWelcomeMessage() {
        const username = localStorage.getItem('pteams-username') || 'Pengguna';
        this.showToast(`Selamat datang, ${username}!`, 'success');
    }
    
    showLogoutMessage() {
        this.showToast('Anda telah berhasil logout', 'info');
    }
    
    showRegisterMessage() {
        this.showToast('Fitur pendaftaran akan segera hadir!', 'info');
    }
    
    showToast(message, type = 'info') {
        // Buat toast element
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.textContent = message;
        
        // Style toast
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 
                         type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 
                         'rgba(33, 150, 243, 0.9)'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10000;
            backdrop-filter: blur(10px);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inisialisasi sistem login setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
    const loginSystem = new LoginSystem();
    
    // Tambahkan style untuk toast message
    const toastStyles = `
        .toast-message {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = toastStyles;
    document.head.appendChild(styleSheet);
});

// WhatsApp Float Button Handler
class WhatsAppButton {
    constructor() {
        this.whatsappBtn = document.getElementById('whatsapp-btn');
        this.whatsappModal = this.createModal();
        this.isModalOpen = false;
        
        this.init();
    }
    
    init() {
        this.whatsappBtn.addEventListener('click', () => {
            this.openModal();
        });
        
        // Close modal when clicking outside
        this.whatsappModal.addEventListener('click', (e) => {
            if (e.target === this.whatsappModal) {
                this.closeModal();
            }
        });
    }
    
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'whatsapp-modal';
        modal.innerHTML = `
            <div class="whatsapp-modal-content">
                <button class="whatsapp-modal-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="whatsapp-modal-header">
                    <h3><i class="fab fa-whatsapp"></i> Hubungi Kami</h3>
                    <p>Kirim pertanyaan atau saran melalui WhatsApp</p>
                </div>
                <form class="whatsapp-form" id="whatsapp-form">
                    <div class="form-group">
                        <input type="text" id="whatsapp-name" placeholder="Nama Anda" required>
                    </div>
                    <div class="form-group">
                        <textarea id="whatsapp-message" placeholder="Pesan Anda..." required></textarea>
                    </div>
                    <button type="submit" class="whatsapp-submit-btn">
                        <i class="fab fa-whatsapp"></i> Kirim via WhatsApp
                    </button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button event
        modal.querySelector('.whatsapp-modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Form submission
        modal.querySelector('#whatsapp-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        return modal;
    }
    
    openModal() {
        this.whatsappModal.classList.add('active');
        this.isModalOpen = true;
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.whatsappModal.classList.remove('active');
        this.isModalOpen = false;
        document.body.style.overflow = '';
        
        // Reset form after closing
        setTimeout(() => {
            this.whatsappModal.querySelector('#whatsapp-form').reset();
        }, 300);
    }
    
    handleSubmit() {
        const name = document.getElementById('whatsapp-name').value.trim();
        const message = document.getElementById('whatsapp-message').value.trim();
        
        if (!name || !message) {
            this.showError('Harap isi semua field!');
            return;
        }
        
        if (name.length < 2) {
            this.showError('Nama harus minimal 2 karakter');
            return;
        }
        
        if (message.length < 10) {
            this.showError('Pesan harus minimal 10 karakter');
            return;
        }
        
        // Format pesan
        const formattedMessage = this.formatMessage(name, message);
        const encodedMessage = encodeURIComponent(formattedMessage);
        const phoneNumber = '+6283111499336';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Redirect ke WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Tampilkan pesan sukses
        this.showSuccess();
        
        // Tutup modal setelah delay
        setTimeout(() => {
            this.closeModal();
        }, 1500);
    }
    
    formatMessage(name, message) {
        return `Halo, saya ${name}.\n\nPesan saya:\n${message}\n\n*Pesan ini dikirim melalui website Pteams*`;
    }
    
    showError(message) {
        // Hapus error sebelumnya
        this.hideError();
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            background: rgba(244, 67, 54, 0.1);
            color: #ff5252;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 15px;
            border: 1px solid rgba(244, 67, 54, 0.3);
            font-size: 0.9rem;
            text-align: center;
        `;
        
        const form = this.whatsappModal.querySelector('#whatsapp-form');
        form.insertBefore(errorElement, form.firstChild);
        
        // Animasi shake
        errorElement.style.animation = 'shakeError 0.5s ease';
        
        // Hapus error setelah 4 detik
        setTimeout(() => {
            this.hideError();
        }, 4000);
    }
    
    hideError() {
        const errorElement = this.whatsappModal.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    showSuccess() {
        const submitBtn = this.whatsappModal.querySelector('.whatsapp-submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Berhasil!';
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 1500);
    }
}

// Inisialisasi WhatsApp Button saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    const whatsappButton = new WhatsAppButton();
});

// WhatsApp Form Handler
class WhatsAppForm {
    constructor() {
        this.form = document.getElementById('question-form');
        this.successMessage = document.getElementById('form-success');
        this.submitBtn = this.form.querySelector('.contact-btn');
        this.isSubmitting = false;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Tambahkan animasi pada input fields
        this.addInputAnimations();
    }
    
    addInputAnimations() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Animasi saat focus
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            // Animasi saat blur
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Validasi real-time
            input.addEventListener('input', () => {
                this.validateField(input);
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        
        if (field.type === 'text' && value.length < 2) {
            this.showFieldError(field, 'Nama harus minimal 2 karakter');
            return false;
        }
        
        if (field.type === 'textarea' && value.length < 10) {
            this.showFieldError(field, 'Pesan harus minimal 10 karakter');
            return false;
        }
        
        this.hideFieldError(field);
        return true;
    }
    
    showFieldError(field, message) {
        this.hideFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff5252;
            font-size: 0.85rem;
            margin-top: 5px;
            animation: slideDown 0.3s ease;
        `;
        
        field.parentElement.appendChild(errorElement);
        field.style.borderColor = '#ff5252';
    }
    
    hideFieldError(field) {
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }
    
    async handleSubmit() {
        if (this.isSubmitting) return;
        
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validasi form
        if (!this.validateForm(name, message)) {
            return;
        }
        
        this.isSubmitting = true;
        this.showLoadingState();
        
        // Simulasi proses pengiriman
        await this.delay(1500);
        
        // Format pesan untuk WhatsApp
        const formattedMessage = this.formatMessage(name, message);
        
        // Encode pesan untuk URL
        const encodedMessage = encodeURIComponent(formattedMessage);
        
        // Nomor WhatsApp tujuan
        const phoneNumber = '+6283111499336';
        
        // Buat URL WhatsApp
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Redirect ke WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Tampilkan pesan sukses
        this.showSuccessMessage();
        
        // Reset form setelah delay
        setTimeout(() => {
            this.resetForm();
            this.isSubmitting = false;
        }, 3000);
    }
    
    validateForm(name, message) {
        let isValid = true;
        
        if (name.length < 2) {
            this.showFieldError(document.getElementById('name'), 'Nama harus minimal 2 karakter');
            isValid = false;
        }
        
        if (message.length < 10) {
            this.showFieldError(document.getElementById('message'), 'Pesan harus minimal 10 karakter');
            isValid = false;
        }
        
        return isValid;
    }
    
    formatMessage(name, message) {
        return `Halo, saya ${name}.\n\nPesan saya:\n${message}\n\n*Pesan ini dikirim melalui website Pteams*`;
    }
    
    showLoadingState() {
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;
    }
    
    hideLoadingState() {
        this.submitBtn.classList.remove('loading');
        this.submitBtn.disabled = false;
    }
    
    showSuccessMessage() {
        this.form.style.display = 'none';
        this.successMessage.classList.add('active');
        
        // Animasi confetti sederhana
        this.createConfetti();
    }
    
    hideSuccessMessage() {
        this.successMessage.classList.remove('active');
        this.form.style.display = 'block';
    }
    
    resetForm() {
        this.form.reset();
        this.hideSuccessMessage();
        this.hideLoadingState();
        
        // Hapus semua error messages
        const errorMessages = this.form.querySelectorAll('.field-error');
        errorMessages.forEach(error => error.remove());
    }
    
    createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.successMessage.appendChild(confettiContainer);
        
        // Buat beberapa confetti
        for (let i = 0; i < 20; i++) {
            this.createConfettiPiece(confettiContainer);
        }
        
        // Hapus confetti setelah animasi selesai
        setTimeout(() => {
            confettiContainer.remove();
        }, 3000);
    }
    
    createConfettiPiece(container) {
        const confetti = document.createElement('div');
        const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${color};
            border-radius: 2px;
            top: -10px;
            left: ${Math.random() * 100}%;
            animation: confettiFall ${1 + Math.random() * 2}s ease-in forwards;
        `;
        
        container.appendChild(confetti);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inisialisasi form WhatsApp saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    const whatsappForm = new WhatsAppForm();
    
    // Tambahkan style untuk animasi confetti
    const confettiStyles = `
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .form-group.focused label {
            color: var(--primary);
            transform: translateY(-5px);
            font-size: 0.9rem;
        }
        
        .form-group {
            transition: all 0.3s ease;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = confettiStyles;
    document.head.appendChild(styleSheet);
});