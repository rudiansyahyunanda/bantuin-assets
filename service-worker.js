// Nama cache
const CACHE_NAME = 'bantuin-cache-v1';

// Daftar file yang akan di-cache saat Service Worker terinstal
// Diperbarui untuk menggunakan URL GitHub secara langsung
const urlsToCache = [
  '/',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/manifest.json',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/service-worker.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://cdn.tailwindcss.com',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/hero.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/main/bantuinsmall.png',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/bantuin-iconmenu-homecolor.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/418cb0394f08ddbbf4c39d7ffb08ca39fbf25ba7/bantuin-iconmenu-walletcolor.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/main/bantuinlogo.gif',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/bantuin-iconmenu-topup.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/bantuin-iconmenu-withdraw.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/bantuin-iconmenu-cart.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/BiFood.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/BiRide.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/BiCar.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/BiDelivery.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/BiUMKM.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/BiTour.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/BiBill.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/lainnya.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/iklanbiride.jpg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/bantuinblack.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/jajanan.jpg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/restoran.jpg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/sarapan.jpg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/bantuin-iconmenu-promo.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/BiLaundry.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/BiService.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/BiClean.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/BiMassage.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/bantuin-iconmenu-riwayat.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/bantuin-iconmenu-pesan.svg',
];

// Event 'install': Saat Service Worker diinstal
self.addEventListener('install', event => {
  console.log('Service Worker: Menginstal...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache berhasil dibuat');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Service Worker: Gagal menambahkan file ke cache', err);
      })
  );
});

// Event 'fetch': Saat browser meminta aset
self.addEventListener('fetch', event => {
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Service Worker: Menggunakan aset dari cache:', event.request.url);
          return response;
        }

        console.log('Service Worker: Mengambil aset dari network:', event.request.url);
        return fetch(event.request)
          .then(res => {
            return caches.open(CACHE_NAME)
              .then(cache => {
                if (res.status === 200) {
                    cache.put(event.request, res.clone());
                }
                return res;
              });
          })
          .catch(() => {
            console.error('Service Worker: Gagal mengambil aset dan tidak ada di cache');
            return caches.match('/offline.html');
          });
      })
  );
});

// Event 'activate': Saat Service Worker diaktifkan
self.addEventListener('activate', event => {
  console.log('Service Worker: Mengaktifkan...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
