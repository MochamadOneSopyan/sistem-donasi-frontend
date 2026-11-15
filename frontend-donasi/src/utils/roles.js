// Satu himpunan permission untuk setiap kelompok; 13 role akun tetap dipertahankan.
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

export const STAFF_ROLES = [
  "ADMIN_SISTEM",
  "BIDANG_INFORMATIKA",
  "KETUA",
  "BENDAHARA",
  "SEKRETARIS",
  "BIDANG_SOSIAL",
  "BIDANG_PENDIDIKAN",
  "BIDANG_KESEHATAN",
  "HUMAS",
  "PENGAWAS",
  "PEMBINA"
];
export const ASSIGNABLE_STAFF_ROLES = STAFF_ROLES;
export const ROLE_GROUPS = Object.freeze({
  "PIMPINAN": [
    "KETUA",
    "PENGAWAS",
    "PEMBINA"
  ],
  "ADMINISTRASI_KEUANGAN": [
    "SEKRETARIS",
    "BENDAHARA"
  ],
  "PENGURUS_OPERASIONAL": [
    "BIDANG_SOSIAL",
    "BIDANG_PENDIDIKAN",
    "BIDANG_KESEHATAN",
    "BIDANG_INFORMATIKA",
    "HUMAS"
  ],
  "ADMIN_SISTEM": [
    "ADMIN_SISTEM"
  ],
  "DONATUR": [
    "DONATUR"
  ],
  "PEMOHON_BANTUAN": [
    "PENERIMA_BANTUAN"
  ]
});
export const GROUP_PERMISSIONS = Object.freeze(Object.fromEntries(Object.entries({
  "ADMIN_SISTEM": [
    "program.view",
    "program.create",
    "program.update",
    "program.delete",
    "donation.view",
    "donation.verify",
    "donation.proof.manage",
    "donor.view",
    "report.view",
    "report.export",
    "summary.view",
    "recipient.view",
    "assistance.view",
    "assistance.verify",
    "assistance.decide",
    "assistance.distribute",
    "user.view",
    "user.create",
    "user.update",
    "user.delete",
    "user.password.reset",
    "user.role.assign"
  ],
  "PIMPINAN": [
    "program.view",
    "program.create",
    "program.update",
    "program.delete",
    "donation.view",
    "report.view",
    "report.export",
    "summary.view",
    "recipient.view",
    "assistance.view",
    "assistance.verify",
    "assistance.decide"
  ],
  "ADMINISTRASI_KEUANGAN": [
    "program.view",
    "donation.view",
    "donation.verify",
    "donation.proof.manage",
    "donor.view",
    "report.view",
    "report.export",
    "summary.view",
    "recipient.view",
    "assistance.view"
  ],
  "PENGURUS_OPERASIONAL": [
    "program.view",
    "program.create",
    "program.update",
    "program.delete",
    "report.view",
    "report.export",
    "summary.view",
    "recipient.view",
    "assistance.view",
    "assistance.verify",
    "assistance.decide",
    "assistance.distribute"
  ],
  "DONATUR": [
    "program.view",
    "donation.view",
    "donation.create",
    "donation.proof.upload"
  ],
  "PEMOHON_BANTUAN": [
    "program.view",
    "assistance.create",
    "assistance.cancel",
    "assistance.view",
    "assistance.received.view"
  ]
}).map(([group, permissions]) => [group, Object.freeze(permissions)])));
export const PERMISSION_ROLES = Object.freeze(Object.fromEntries(["program.view","program.create","program.update","program.delete","donation.view","donation.verify","donation.proof.manage","donor.view","donation.create","donation.proof.upload","report.view","report.export","summary.view","recipient.view","assistance.create","assistance.cancel","assistance.view","assistance.verify","assistance.decide","assistance.distribute","assistance.received.view","user.view","user.create","user.update","user.delete","user.password.reset","user.role.assign","publication.manage"].map(permission => [permission, Object.freeze(Object.entries(ROLE_GROUPS).filter(([group]) => GROUP_PERMISSIONS[group].includes(permission)).flatMap(([, roles]) => roles))])));
const PERMISSION_ALIASES = Object.freeze({
  "LIHAT_RINGKASAN": "summary.view",
  "KELOLA_PROGRAM": "program.create",
  "VERIFIKASI_DONASI": "donation.verify",
  "LIHAT_DONASI": "donation.view",
  "LIHAT_DONATUR": "donor.view",
  "LIHAT_PENERIMA": "recipient.view",
  "KELOLA_PENERIMA": "assistance.verify",
  "LIHAT_PENGAJUAN": "assistance.view",
  "VERIFIKASI_PENGAJUAN": "assistance.decide",
  "KELOLA_PENYALURAN": "assistance.distribute",
  "LIHAT_LAPORAN": "report.view",
  "KELOLA_PENGGUNA": "user.view"
});
const PERMISSIONS = Object.freeze({ ...PERMISSION_ROLES, ...Object.fromEntries(Object.entries(PERMISSION_ALIASES).map(([name, target]) => [name, PERMISSION_ROLES[target]])) });
export function can(role, permission) {
  return Boolean(role && Object.prototype.hasOwnProperty.call(PERMISSIONS, permission) && PERMISSIONS[permission].includes(role));
}
export function isStaffRole(role) { return STAFF_ROLES.includes(role); }

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
const DEFAULT_MENU_BY_GROUP = {
  ADMIN_SISTEM: "pengurus", PIMPINAN: "program", ADMINISTRASI_KEUANGAN: "donasi",
  PENGURUS_OPERASIONAL: "program",
};
const DEFAULT_MENU_BY_ROLE = Object.fromEntries(Object.entries(ROLE_GROUPS).flatMap(([group, roles]) => roles.map(role => [role, DEFAULT_MENU_BY_GROUP[group]])));

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
