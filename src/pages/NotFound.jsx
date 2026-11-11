import { Link } from 'react-router-dom';
export default function NotFound() {
  return <main className="public-ui ds-container py-32 text-center"><h1>Halaman tidak ditemukan</h1><p className="my-6">Alamat yang Anda buka tidak tersedia.</p><Link to="/" className="ds-button ds-button-primary">Kembali ke beranda</Link></main>;
}
