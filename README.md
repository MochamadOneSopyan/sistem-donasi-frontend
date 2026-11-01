# Sistem Donasi Yayasan Mulia Karya Bersama — Frontend

Aplikasi web untuk menampilkan program donasi, menerima pengajuan donasi, dan membantu pengurus yayasan mencatat serta memantau penyaluran bantuan.

Frontend ini dibuat dengan **React, Vite, dan Tailwind CSS**. Data akun, program, donasi, dan laporan diperoleh dari backend API yang terpisah.

## Fitur

- Halaman publik berisi informasi yayasan, program donasi, galeri, dan laporan transparansi.
- Formulir donasi dengan pembayaran QRIS dan unggah bukti pembayaran.
- Pendaftaran, login, dan pemulihan kata sandi.
- Dashboard donatur untuk melihat riwayat dan status donasi.
- Dashboard penerima bantuan untuk melihat serta mengajukan bantuan.
- Dashboard pengurus untuk mengelola program, memverifikasi data, dan mencatat penyaluran.
- Tampilan responsif untuk desktop dan perangkat seluler.

> Status pembayaran diperiksa oleh pengurus. Frontend ini tidak mengklaim bahwa pembayaran terverifikasi secara otomatis oleh penyedia pembayaran.

## Teknologi

- React 19 dan React Router
- Vite 8
- Tailwind CSS
- Axios
- Recharts
- Vitest dan Testing Library

## Menjalankan secara lokal

Pastikan **Node.js 20.19+ atau 22.12+** dan npm sudah terpasang. Jalankan perintah berikut dari root repo:

```bash
npm ci
cp .env.example .env
npm run dev
```

Isi `.env` dengan alamat backend API:

```env
VITE_API_URL=http://localhost:3000/api
```

Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173`. Backend harus berjalan secara terpisah agar fitur yang mengambil atau mengubah data dapat digunakan.

## Variabel lingkungan

| Variabel | Kegunaan |
| --- | --- |
| `VITE_API_URL` | Alamat backend API, termasuk akhiran `/api`. |
| `VITE_SITE_URL` | Opsional: alamat HTTPS publik untuk canonical URL dan sitemap. |

Contoh untuk deployment:

```env
VITE_API_URL=https://nama-backend.example.com/api
VITE_SITE_URL=https://nama-website.example.com
```

Variabel `VITE_*` akan masuk ke hasil build dan dapat dilihat di browser. **Jangan simpan password, token rahasia, atau kredensial database di sini.**

## Perintah yang tersedia

```bash
npm run dev      # Jalankan server pengembangan
npm run build    # Buat hasil produksi di folder dist/
npm run preview  # Pratinjau hasil build
npm test         # Jalankan tes
npm run lint     # Periksa aturan ESLint
```

## Deployment

Frontend dapat di-deploy sebagai situs statis, misalnya di Netlify atau Vercel.

- **Build command:** `npm run build`
- **Publish/output directory:** `dist`
- **Environment variable:** isi `VITE_API_URL` dengan alamat backend yang dapat diakses publik.

Untuk **Vercel**, konfigurasi route aplikasi sudah tersedia di `vercel.json`.

Untuk **Netlify**, tambahkan file `public/_redirects` dengan isi berikut agar halaman seperti `/login` tetap terbuka saat di-refresh:

```text
/*  /index.html  200
```

Repo ini juga memiliki salinan aplikasi di folder `frontend-donasi/`. Jika platform deployment diarahkan ke folder tersebut, jalankan perintah build dari folder itu dan gunakan `dist` sebagai outputnya.

## Catatan penggunaan

Aplikasi ini memerlukan backend dan database yang aktif. Sebelum digunakan untuk menerima donasi sungguhan, pastikan penyimpanan bukti pembayaran bersifat permanen serta alur verifikasi pembayaran telah diuji pada lingkungan produksi.
