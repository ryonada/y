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