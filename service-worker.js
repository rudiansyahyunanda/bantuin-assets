// Nama cache
const CACHE_NAME = 'bantuin-cache-v1';

// Daftar file yang akan di-cache saat Service Worker terinstal
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://cdn.tailwindcss.com',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/hero.svg',
  'https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/main/bantuinsmall.png',
  // Tambahkan semua aset penting lainnya (CSS, JS, gambar, dll.)
];

// Event 'install': Saat Service Worker diinstal
self.addEventListener('install', event => {
  console.log('Service Worker: Menginstal...');
  // Tunggu hingga cache berhasil dibuka dan semua file ditambahkan
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
  // Jika request bukan 'only-if-cached' (biasanya dari Safari)
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }
  
  event.respondWith(
    // Coba mencocokkan request dengan aset di cache
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, gunakan dari cache
        if (response) {
          console.log('Service Worker: Menggunakan aset dari cache:', event.request.url);
          return response;
        }

        // Jika tidak ada di cache, lakukan fetch dari network
        console.log('Service Worker: Mengambil aset dari network:', event.request.url);
        return fetch(event.request)
          .then(res => {
            // Jika respons valid, tambahkan ke cache untuk penggunaan selanjutnya
            return caches.open(CACHE_NAME)
              .then(cache => {
                if (res.status === 200) {
                    // Kloning respons karena stream hanya bisa dibaca sekali
                    cache.put(event.request, res.clone());
                }
                return res;
              });
          })
          .catch(() => {
            // Jika network gagal, berikan respons offline (jika ada)
            console.error('Service Worker: Gagal mengambil aset dan tidak ada di cache');
            return caches.match('/offline.html');
          });
      })
  );
});

// Event 'activate': Saat Service Worker diaktifkan
self.addEventListener('activate', event => {
  console.log('Service Worker: Mengaktifkan...');
  // Hapus cache lama
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
