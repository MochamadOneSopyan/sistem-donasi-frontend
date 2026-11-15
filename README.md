# Frontend Sistem Donasi Yayasan

React 19, Vite 8, React Router 7, Tailwind CSS, Axios dan Recharts. Gunakan Node.js22. Root utama berada di sistem-donasi-frontend; salinan frontend-donasi tetap dilacak dan source terkait dijaga sama.

Salin .env.example, isi VITE_API_URL menuju backend nyata (akhiran /api), VITE_SITE_URL untuk domain HTTPS terverifikasi dan VITE_DEMO_MODE sesuai keputusan pembukaan donasi. Tidak boleh menaruh SMTP, JWT secret, database URL, atau API secret Cloudinary pada VITE_*.

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
```

Dist disajikan lewat host statis HTTPS dengan fallback route SPA. Sidebar/tombol mengikuti kelompok akses; otorisasi final tetap di backend. Navbar dashboard diakses lewat nama akun, dan desain/hero existing dipertahankan.

Tabel memakai pagination client10row; data API masih dimuat seluruhnya. Detail program memakai dialog, bukan halaman route terpisah. Galeri/kontak masih statis, bukan CMS. Statistik transparansi memakai data API dan animasi viewport/reduced-motion existing.

## RBAC dan batas rilis

Tiga belas role akun dipertahankan, dengan permission sama untuk setiap anggota dari enam kelompok akses. Hanya Admin Sistem dapat mengelola akun/role. Izin backend tetap menjadi sumber otorisasi; menyembunyikan menu saja tidak memberi perlindungan API.

Frontend dapat diuji/build sendiri tanpa checkout repository backend. Pengujian memakai mock API, bukan pembayaran atau database produksi. Laporan audit, screenshot dan fixture browser dari workspace tidak disertakan dalam rilis inti ini.

Sebelum go-live, backend harus lulus konfigurasi Resend atau SMTP/HTTPS/volume, rekonsiliasi schema dan acceptance staging. Jangan mengarahkan transaksi nyata hanya berdasarkan build frontend yang berhasil.

## Pemeriksaan rilis

Isi konfigurasi produksi sebelum build: lihat [deployment/production.env.example](deployment/production.env.example).
Jalankan `npm run check:production` untuk menolak URL localhost/non-HTTPS, mode demo dan nama variabel rahasia VITE_. Pemeriksaan tidak menghubungi backend dan tidak menggantikan uji login, reset password, donasi serta upload pada produksi.

Urutan rilis: `npm run check:production`, `npm test`, `npm run lint`, `npm run build`. Build tidak otomatis dijadikan produksi hanya karena perintah build lulus. VITE_API_URL harus URL backend berakhiran /api; VITE_SITE_URL adalah origin frontend HTTPS.
