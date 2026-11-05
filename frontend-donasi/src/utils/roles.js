// Salinan matriks 13 role RBAC backend (backend-donasi/src/roles.js) untuk mengatur tampilan.
// Ini hanya lapisan UI; otorisasi sebenarnya tetap dicek oleh backend.

export const ROLE_LABELS = {
  ADMIN_SISTEM: "Admin Sistem",
  BIDANG_INFORMATIKA: "Bidang Informatika",
  KETUA: "Ketua Yayasan",
  BENDAHARA: "Bendahara",
  SEKRETARIS: "Sekretaris",
  BIDANG_SOSIAL: "Bidang Sosial",
  BIDANG_PENDIDIKAN: "Bidang Pendidikan",
  BIDANG_KESEHATAN: "Bidang Kesehatan",
  HUMAS: "Humas",
  PENGAWAS: "Pengawas",
  PEMBINA: "Pembina",
  DONATUR: "Donatur",
  PENERIMA_BANTUAN: "Penerima Bantuan",
};

const FULL_ACCESS_ROLES = ["ADMIN_SISTEM", "BIDANG_INFORMATIKA"];

export const STAFF_ROLES = Object.keys(ROLE_LABELS).filter(
  (role) => role !== "DONATUR" && role !== "PENERIMA_BANTUAN",
);

export const ASSIGNABLE_STAFF_ROLES = STAFF_ROLES;

const BIDANG = ["BIDANG_SOSIAL", "BIDANG_PENDIDIKAN", "BIDANG_KESEHATAN"];
const PEMANTAU_LAPORAN = [
  "KETUA",
  "BENDAHARA",
  "SEKRETARIS",
  "PENGAWAS",
  "PEMBINA",
  "HUMAS",
  ...BIDANG,
];

const PERMISSIONS = {
  LIHAT_RINGKASAN: STAFF_ROLES,
  KELOLA_PROGRAM: ["KETUA", "HUMAS"],
  VERIFIKASI_DONASI: ["BENDAHARA"],
  LIHAT_DONASI: ["BENDAHARA", "KETUA", "SEKRETARIS", "PENGAWAS", "PEMBINA"],
  LIHAT_DONATUR: ["BENDAHARA"],
  LIHAT_PENERIMA: ["KETUA", "SEKRETARIS", ...BIDANG],
  KELOLA_PENERIMA: ["KETUA", ...BIDANG],
  LIHAT_PENGAJUAN: ["KETUA", "SEKRETARIS", ...BIDANG],
  VERIFIKASI_PENGAJUAN: ["KETUA", ...BIDANG],
  KELOLA_PENYALURAN: BIDANG,
  LIHAT_LAPORAN: PEMANTAU_LAPORAN,
  KELOLA_PENGGUNA: [],
};

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role);
}

export function can(role, permission) {
  if (!role) return false;
  if (FULL_ACCESS_ROLES.includes(role)) return true;
  return (PERMISSIONS[permission] || []).includes(role);
}

// Menu panel pengurus dan hak aksesnya.
export const MENU_PERMISSION = {
  verifikasi: "LIHAT_PENERIMA",
  pengajuan: "LIHAT_PENGAJUAN",
  program: "KELOLA_PROGRAM",
  donasi: "LIHAT_DONASI",
  penerima: "LIHAT_PENERIMA",
  donatur: "LIHAT_DONATUR",
  pengurus: "KELOLA_PENGGUNA",
  laporan: "LIHAT_LAPORAN",
  profil: "LIHAT_RINGKASAN",
};

// Menu awal yang paling relevan untuk setiap role saat membuka /admin
const DEFAULT_MENU_BY_ROLE = {
  ADMIN_SISTEM: "verifikasi",
  BIDANG_INFORMATIKA: "pengurus",
  KETUA: "program",
  HUMAS: "program",
  BENDAHARA: "donasi",
  SEKRETARIS: "pengajuan",
  BIDANG_SOSIAL: "verifikasi",
  BIDANG_PENDIDIKAN: "verifikasi",
  BIDANG_KESEHATAN: "verifikasi",
  PENGAWAS: "laporan",
  PEMBINA: "laporan",
};

export function canSeeMenu(role, menu) {
  return can(role, MENU_PERMISSION[menu]);
}

export function firstMenuFor(role) {
  const preferred = DEFAULT_MENU_BY_ROLE[role];
  if (preferred && canSeeMenu(role, preferred)) return preferred;
  const menus = Object.keys(MENU_PERMISSION).filter((menu) => menu !== "profil");
  return menus.find((menu) => canSeeMenu(role, menu)) || "profil";
}

export function homePathFor(role) {
  if (isStaffRole(role)) return "/admin";
  if (role === "PENERIMA_BANTUAN") return "/penerima";
  if (role === "DONATUR") return "/donatur";
  return "/";
}
