// --- Logika Aplikasi Utama (dioptimalkan) ---
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Mengamati elemen 'lazy' (gambar, picture) dan memuatnya saat mendekati viewport.
     * Menggunakan IntersectionObserver untuk performa tinggi.
     */
    const lazyElements = document.querySelectorAll('.lazy');
    if ('IntersectionObserver' in window) {
        const lazyObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Handle <picture> elements
                    if (element.tagName === 'PICTURE') {
                        const sources = element.querySelectorAll('source');
                        const img = element.querySelector('img');
                        sources.forEach(source => {
                            if (source.dataset.srcset) {
                                source.srcset = source.dataset.srcset;
                                source.removeAttribute('data-srcset');
                            }
                        });
                        if (img && img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                    }
                    // Handle <img> elements
                    else if (element.tagName === 'IMG' && element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }

                    element.classList.remove('lazy');
                    observer.unobserve(element);
                }
            });
        }, { rootMargin: '300px 0px' }); // Preload 300px sebelum masuk viewport

        lazyElements.forEach(el => lazyObserver.observe(el));
    }

    /**
     * Logika navigasi halaman utama (Home, Promo, Riwayat, Pesan).
     * Mengganti kelas 'active' pada tombol dan halaman yang sesuai.
     */
    const navButtons = document.querySelectorAll('nav.bottom-nav button');
    const pages = document.querySelectorAll('section.page');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentActiveButton = document.querySelector('nav.bottom-nav button.active');
            if (button === currentActiveButton) return;

            const targetId = button.dataset.target;

            if (currentActiveButton) {
                currentActiveButton.classList.remove('active');
            }
            button.classList.add('active');

            pages.forEach(p => p.classList.toggle('active', p.id === targetId));
        });
    });

    /**
     * Menyembunyikan/menampilkan navigasi bawah saat scroll untuk UX yang lebih baik.
     * Menggunakan requestAnimationFrame untuk efisiensi.
     */
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
        let lastScrollY = window.pageYOffset;
        let ticking = false;

        const onScroll = () => {
            const currentScrollY = window.pageYOffset;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Sembunyikan jika scroll ke bawah, tampilkan jika ke atas
                    bottomNav.classList.toggle('hide', currentScrollY > lastScrollY && currentScrollY > 50);
                    lastScrollY = Math.max(currentScrollY, 0);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /**
     * Logika Hero Slider otomatis.
     * Berhenti saat tab tidak aktif untuk menghemat CPU.
     */
    const slides = document.querySelectorAll('.hero-slider .slides .slide-item');
    const dots = document.querySelectorAll('.slider-indicators .dot');
    if (slides.length > 1) {
        let currentIndex = 0;
        let sliderInterval = null;

        const showSlide = (index) => {
            slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        };

        const startSlider = () => {
            if (sliderInterval) return;
            sliderInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            }, 4000);
        };

        const stopSlider = () => {
            clearInterval(sliderInterval);
            sliderInterval = null;
        };

        startSlider();
        document.addEventListener('visibilitychange', () => {
            document.hidden ? stopSlider() : startSlider();
        });
    }

    /**
     * Logika animasi saldo GIF.
     */
    const saldoLeftInner = document.querySelector('.saldo-left-inner');
    const gifContainer = document.querySelector('.gif-container');
    if (saldoLeftInner && gifContainer) {
        let saldoAnimationTimeout;

        const playSaldoAnimation = () => {
            clearTimeout(saldoAnimationTimeout);
            saldoLeftInner.style.display = 'flex';
            gifContainer.style.display = 'none';
            saldoAnimationTimeout = setTimeout(() => {
                saldoLeftInner.style.display = 'none';
                gifContainer.style.display = 'block';
                saldoAnimationTimeout = setTimeout(() => {
                    saldoLeftInner.style.display = 'flex';
                    gifContainer.style.display = 'none';
                }, 5000);
            }, 3000);
        };
        
        playSaldoAnimation();
        
        const homeButton = document.querySelector('button[data-target="home"]');
        if(homeButton) {
            homeButton.addEventListener('click', () => {
                // Jika kembali ke tab home, putar ulang animasi
                if(homeButton.classList.contains('active')) {
                   setTimeout(playSaldoAnimation, 100);
                }
            });
        }
    }

    /**
     * Logika untuk membuka/menutup popup "Lainnya".
     */
    const btnLainnya = document.getElementById('btnLainnya');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupLainnya = document.getElementById('popupLainnya');
    if (btnLainnya && popupOverlay && popupLainnya) {
        const openPopup = () => {
            popupOverlay.classList.add('show');
            popupLainnya.classList.add('show');
            if (bottomNav) bottomNav.classList.add('hide');
        };
        const closePopup = () => {
            popupOverlay.classList.remove('show');
            popupLainnya.classList.remove('show');
            if (bottomNav && window.pageYOffset < 50) {
                bottomNav.classList.remove('hide');
            }
        };
        btnLainnya.addEventListener('click', (e) => { e.preventDefault(); openPopup(); });
        popupOverlay.addEventListener('click', closePopup);
    }
});

/**
 * Registrasi Service Worker untuk fungsionalitas PWA (Progressive Web App).
 * Ini akan memungkinkan caching untuk penggunaan offline.
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(error => {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}
