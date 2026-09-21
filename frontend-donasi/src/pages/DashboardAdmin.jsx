import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  PlusCircle,
  FileSpreadsheet,
  FileText,
  Download,
  KeyRound,
} from "lucide-react";

export default function DashboardAdmin() {
  const [pengurusList, setPengurusList] = useState([]);
  const [loading, setLoading] = useState(false);

  // State Modal Tambah Pengurus
  const [modalOpen, setModalOpen] = useState(false);

  // State Modal Reset Password
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedPengurus, setSelectedPengurus] = useState(null);
  const [passwordBaru, setPasswordBaru] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchDaftarPengurus();
  }, []);

  const fetchDaftarPengurus = () => {
    API.get("/admin/pengurus")
      .then((res) => setPengurusList(res.data.data || []))
      .catch((err) => console.error("Gagal mengambil daftar pengurus:", err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Tambah Pengurus Baru
  const handleTambahPengurus = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/admin/pengurus", formData);
      setSuccess("Akun pengurus baru berhasil ditambahkan!");
      setFormData({ nama: "", email: "", password: "" });
      fetchDaftarPengurus();
      setTimeout(() => {
        setModalOpen(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menambahkan pengurus baru.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit Reset Password Pengurus
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedPengurus) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await API.put(
        `/admin/pengurus/${selectedPengurus.id}/reset-password`,
        { passwordBaru },
      );
      setSuccess(res.data.message || "Password berhasil di-reset!");
      setPasswordBaru("");
      setTimeout(() => {
        setResetModalOpen(false);
        setSuccess("");
        setSelectedPengurus(null);
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mereset password pengurus.",
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadLaporan = async (type) => {
    try {
      const response = await API.get(`/laporan/${type}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `laporan-penyaluran.${type === "pdf" ? "pdf" : "xlsx"}`,
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Gagal mengunduh laporan!");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl min-h-screen font-sans text-slate-800">
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 text-left">
            Dashboard Pengurus Yayasan
          </h1>
          <p className="text-xs text-slate-500 mt-1 text-left">
            Kelola program, laporan penyaluran, serta keanggotaan pengurus
            internal
          </p>
        </div>

        {/* Tombol Buka Modal Tambah Pengurus */}
        <button
          onClick={() => {
            setError("");
            setSuccess("");
            setModalOpen(true);
          }}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-5 py-3 rounded-2xl shadow-lg shadow-emerald-800/20 transition flex items-center gap-2 text-xs uppercase tracking-wider self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" /> Tambah Pengurus Baru
        </button>
      </div>

      {/* Card Export Laporan */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm mb-8 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-800">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">
              Export Laporan Penyaluran Program
            </h3>
            <p className="text-xs text-slate-400">
              Unduh rekapitulasi data penyaluran bantuan dalam format PDF atau
              Excel
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => downloadLaporan("pdf")}
            className="bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs px-5 py-3 rounded-2xl border border-red-200 transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button
            onClick={() => downloadLaporan("excel")}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs px-5 py-3 rounded-2xl border border-emerald-200 transition flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Tabel Daftar Pengurus Active */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between text-left">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" /> Daftar
              Pengurus Terdaftar
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Anggota staf & tim manajemen yang memiliki akses dashboard admin
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full">
            {pengurusList.length} Pengurus
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-black text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Nama Pengurus</th>
                <th className="p-4">Alamat Email</th>
                <th className="p-4">Tanggal Dibuat</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pengurusList.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-6 text-center text-slate-400 font-medium"
                  >
                    Belum ada pengurus lain terdaftar.
                  </td>
                </tr>
              ) : (
                pengurusList.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                        {p.nama.charAt(0).toUpperCase()}
                      </div>
                      {p.nama}
                    </td>
                    <td className="p-4 font-semibold text-slate-600">
                      {p.email}
                    </td>
                    <td className="p-4 font-medium text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedPengurus(p);
                          setError("");
                          setSuccess("");
                          setPasswordBaru("");
                          setResetModalOpen(true);
                        }}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-3 py-1.5 rounded-xl border border-amber-200 transition flex items-center gap-1 text-[11px]"
                        title="Reset Password Pengurus Ini"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Reset Password
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: FORM TAMBAH PENGURUS BARU */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-6 relative text-left">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-black flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-300" /> Tambah Pengurus
                Baru
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1">
                Buat akun kredensial untuk pengurus/staf yayasan baru
              </p>
            </div>

            <form
              onSubmit={handleTambahPengurus}
              className="p-6 space-y-4 text-left"
            >
              {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl border border-emerald-100 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
                </div>
              )}

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap Pengurus
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="nama"
                    placeholder="Nama lengkap pengurus"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Alamat Email Resmi
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="email@muliakaryabersama.or.id"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password Sementara
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  <PlusCircle className="w-4 h-4" />{" "}
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET PASSWORD PENGURUS */}
      {resetModalOpen && selectedPengurus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-amber-800 to-amber-950 text-white p-6 relative text-left">
              <button
                onClick={() => setResetModalOpen(false)}
                className="absolute right-4 top-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-black flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-300" /> Reset Password
                Pengurus
              </h3>
              <p className="text-xs text-amber-100/90 mt-1">
                Ubah password untuk akun{" "}
                <span className="font-bold underline">
                  {selectedPengurus.nama}
                </span>
              </p>
            </div>

            <form
              onSubmit={handleResetPassword}
              className="p-6 space-y-4 text-left"
            >
              {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl border border-emerald-100 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
                </div>
              )}

              {/* Input Password Baru */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password Baru
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Masukkan password baru (minimal 6 karakter)"
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-amber-800 hover:bg-amber-900 text-white font-extrabold py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  <KeyRound className="w-4 h-4" />{" "}
                  {loading ? "Memproses..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
