import { Link } from "react-router-dom";
import { getStoredUser } from "../utils/format";
import { homePathFor } from "../utils/roles";
export default function Unauthorized() {
  return <main className="public-ui ds-container py-32 text-center"><h1 className="text-3xl font-bold">Akses ditolak</h1><p className="my-6">Akun Anda tidak memiliki izin untuk membuka halaman ini.</p><Link className="ds-button ds-button-primary" to={homePathFor(getStoredUser()?.role)}>Kembali ke dashboard</Link></main>;
}
