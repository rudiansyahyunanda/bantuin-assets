<!-- ========== SCRIPT BOT CHAT BARU ========== -->
<script>
    // API key akan otomatis diisi oleh Canvas
    const API_KEY = 'AIzaSyApq-DIsbOsrxNd9B4KtuxkRjVI_w7zcgw';

    // Logika navigasi
    const btnPesan = document.getElementById('btnPesan');
    const btnJawabanCepat = document.getElementById('btnJawabanCepat');
    const pesanSection = document.getElementById('pesan-section');
    const jawabanCepatSection = document.getElementById('jawaban-cepat-section');
    const bottomNav = document.getElementById('bottomNav');

    btnPesan.addEventListener('click', () => {
        pesanSection.classList.add('active');
        jawabanCepatSection.classList.remove('active');
        btnPesan.classList.add('active');
        btnJawabanCepat.classList.remove('active');
    });

    btnJawabanCepat.addEventListener('click', () => {
        pesanSection.classList.remove('active');
        jawabanCepatSection.classList.add('active');
        btnPesan.classList.remove('active');
        btnJawabanCepat.classList.add('active');
    });

    function showJawabanCepat() {
        btnJawabanCepat.click();
    }

    const chatBox = document.querySelector('#jawaban-cepat-section #chat-box');
    const inputPesan = document.querySelector('#jawaban-cepat-section #input-pesan');
    const kirimBtn = document.querySelector('#jawaban-cepat-section #kirim-btn');
    const scrollUpBtn = document.getElementById('scroll-up-btn');
    const username = "Budi";
    let chatHistory = [];

    function resetChat() {
        chatHistory = [];
        chatBox.innerHTML = `
            <div class="chat-bubble-bot fade-in-message">
                <img src="https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/maskotbantuin.webp"
                    alt="Bantuin Maskot" class="avatar-bot" />
                <div class="bg-gray-200 text-gray-800 rounded-xl p-3 max-w-[80%] shadow-sm text-base leading-relaxed">
                    Halo ${username}, saya BiBot, asisten virtual Bantuin. Silakan ajukan pertanyaan seputar layanan kami atau pilih topik di bawah.
                </div>
            </div>
        `;
        tampilkanRekomendasiTopik();
    }

    function tampilkanRekomendasiTopik() {
        const rekomendasiTopik = [
            { text: "Apa itu BiRide?", class: "bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-md", prompt: "Apa itu BiRide?" },
            { text: "Syarat Jadi Driver?", class: "bg-green-500 text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-md", prompt: "Apa saja syarat menjadi driver Bantuin?" },
            { text: "Promo Hari Ini?", class: "bg-yellow-500 text-black rounded-lg px-4 py-2 text-sm font-semibold shadow-md", prompt: "Apakah ada promo hari ini?" },
        ];

        const divRekomendasi = document.createElement('div');
        divRekomendasi.className = 'flex flex-wrap gap-2 mt-4 fade-in-message';

        rekomendasiTopik.forEach(rec => {
            const button = document.createElement('button');
            button.textContent = rec.text;
            button.className = rec.class;
            button.addEventListener('click', () => {
                inputPesan.value = rec.prompt;
                kirimPesan();
            });
            divRekomendasi.appendChild(button);
        });

        chatBox.appendChild(divRekomendasi);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function dapatkanBalasanAI(pesan) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

        // PROMPT ALL-IN-ONE
        const prompt = `Anda adalah BiBot, asisten virtual aplikasi Bantuin. Jawablah profesional, jelas, dan terstruktur. 
        Fokus hanya pada Bantuin. Jika pertanyaan di luar konteks, jawab singkat lalu arahkan kembali ke Bantuin.

        ### Profil Perusahaan
        - Nama: Bantuin (PT Bantuin Teknologi Indonesia).
        - CEO: Rudiansyah Yunanda.
        - Visi: Memberdayakan SDM lokal, mendorong ekonomi digital, skala nasional.
        - Berdiri: 2022, Beta Des 2023, resmi Apr 2024.
        - Ekosistem: Aplikasi Bantuin (konsumen), Mitra Bantuin (merchant), Driver Bantuin (driver).

        ### Layanan
        - BiRide: Motor untuk penumpang & barang ringan/dokumen. Tarif: minimum + Rp 2.300/km. Jarak maks. 25 km. Tidak bisa double order penumpang. Boleh order tambahan barang jika aman.
        - BiDelivery: Pengiriman paket/dokumen point-to-point. Tarif: Rp 2.300/km setelah minimum. Barang sesuai aturan keamanan.
        - BiCar: Transportasi mobil. Tarif sedikit lebih murah dari pasar. Potongan aplikasi 10%.
        - BiFood: Pesan-antar makanan. Harga menu sama dengan harga offline. Tidak ada markup. Biaya layanan Rp 1.000/transaksi. Ongkir sesuai tarif antar.

        ### Mitra Driver
        - Daftar via aplikasi Driver Bantuin (Play Store).
        - Syarat: KTP, SIM (C/A), STNK, kendaraan layak, usia min. 18/21 th.
        - Potongan aplikasi: 10% tiap order.
        - Saldo minimum Rp 20.000 untuk menerima order.
        - Atribut (helm/jaket): Wajib saat bertugas. Mekanisme bisa cicilan/biaya awal. Jika rusak/hilang → bisa ajukan penggantian.
        - Training: Opsional, tergantung kebijakan.
        - Tidak boleh ganti layanan saat order berjalan (kecuali pembatalan).
        - Pembatalan: Gratis, tapi berdampak ke penilaian akun.

        ### Mitra Merchant
        - Daftar via aplikasi Mitra Bantuin (Play Store).
        - Gratis (tidak ada biaya daftar, tahunan, atau komisi %).
        - Harga produk = harga offline. Tidak ada markup.

        ### Kebijakan Umum
        - Wilayah: Beroperasi di kota dengan driver tersedia. Ekspansi diumumkan berkala.
        - Pembayaran: Cash, payment gateway, dompet digital, Bantuin Pay.
        - Promo & diskon: Ada sesuai kebijakan perusahaan.
        - Komunikasi: Chat & telp via aplikasi saat order berlangsung.
        - Asuransi: Belum tersedia.
        - Tidak bisa pesan BiRide untuk orang lain. Disarankan mereka download aplikasi sendiri.

        Pertanyaan: ${pesan}`;

        const currentChat = chatHistory.slice(-5);
        currentChat.push({ role: "user", parts: [{ text: prompt }] });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: currentChat })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API error:", response.status, errorData);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
                const balasan = data.candidates[0].content.parts[0].text;
                chatHistory.push({ role: "model", parts: [{ text: balasan }] });
                return balasan;
            } else {
                return "Maaf, balasan tidak tersedia. Silakan coba lagi.";
            }

        } catch (error) {
            console.error("Error fetch AI:", error);
            return "Maaf, terjadi kesalahan. Silakan coba lagi.";
        }
    }

    function formatBalasanBot(teksBalasan) {
        let formattedText = teksBalasan.replace(/^- \*\*(.*?)\*\*: (.*)$/gm, '<li><strong>$1:</strong> $2</li>');
        formattedText = `<ul>${formattedText}</ul>`;

        return `<div class="bg-gray-200 text-gray-800 rounded-xl p-3 max-w-[80%] shadow-sm text-base leading-relaxed">
                    ${formattedText}
                </div>`;
    }

    async function kirimPesan() {
        const pesanPengguna = inputPesan.value.trim();
        if (pesanPengguna === '') return;

        chatHistory.push({ role: "user", parts: [{ text: pesanPengguna }] });
        tampilkanPesan('user', pesanPengguna);
        inputPesan.value = '';

        const loadingMessageDiv = tampilkanPesan('bot', `<span class="typing-indicator">Sedang mengetik<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></span>`, true);

        try {
            const balasanBotTeks = await dapatkanBalasanAI(pesanPengguna);
            const balasanBotHTML = formatBalasanBot(balasanBotTeks);

            const pesanContainer = loadingMessageDiv.closest('.chat-bubble-bot');
            pesanContainer.innerHTML = `
                <img src="https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/maskotbantuin.webp" alt="Bantuin Maskot" class="avatar-bot" />
                ${balasanBotHTML}
            `;
        } catch (error) {
            const pesanContainer = loadingMessageDiv.closest('.chat-bubble-bot');
            pesanContainer.innerHTML = `
                <img src="https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/maskotbantuin.webp" alt="Bantuin Maskot" class="avatar-bot" />
                <div class="bg-gray-200 text-gray-800 rounded-xl p-3 max-w-[80%] shadow-sm">
                    Maaf, terjadi kesalahan. Silakan coba lagi.
                </div>
            `;
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function tampilkanPesan(pengirim, teks, isHtml = false) {
        const divPesanContainer = document.createElement('div');
        let pesanHTML;
        let containerClass;

        if (pengirim === 'user') {
            containerClass = 'chat-bubble-user fade-in-message';
            pesanHTML = `
                <div class="bg-sky-500 text-white rounded-xl p-3 max-w-[80%] shadow-sm text-base leading-relaxed">
                    ${teks}
                </div>
                <img src="{foto}" alt="Avatar Pengguna" class="avatar-user" />
            `;
        } else {
            containerClass = 'chat-bubble-bot fade-in-message';
            pesanHTML = `
                <img src="https://raw.githubusercontent.com/rudiansyahyunanda/bantuin-assets/refs/heads/main/maskotbantuin.webp" alt="Bantuin Maskot" class="avatar-bot" />
                ${isHtml ? teks : `<div class="bg-gray-200 text-gray-800 rounded-xl p-3 max-w-[80%]">${teks}</div>`}
            `;
        }

        divPesanContainer.className = containerClass;
        divPesanContainer.innerHTML = pesanHTML;
        chatBox.appendChild(divPesanContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
        return divPesanContainer.querySelector('div.bg-gray-200, div.bg-sky-500, span.typing-indicator');
    }

    kirimBtn.addEventListener('click', kirimPesan);
    inputPesan.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') kirimPesan();
    });

    inputPesan.addEventListener('focus', () => bottomNav.classList.add('hide'));
    inputPesan.addEventListener('blur', () => bottomNav.classList.remove('hide'));

    const scrollAmount = 150;
    scrollUpBtn.addEventListener('click', () => {
        chatBox.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    });

    btnJawabanCepat.addEventListener('click', () => {
        resetChat();
    });
</script>
