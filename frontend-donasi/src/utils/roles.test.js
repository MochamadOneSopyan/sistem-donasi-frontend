import { describe, it, expect } from "vitest";
import {
  ROLE_LABELS,
  STAFF_ROLES,
  ASSIGNABLE_STAFF_ROLES,
  can,
  canSeeMenu,
  firstMenuFor,
  homePathFor,
} from "./roles";

describe("RBAC frontend roles", () => {
  it("mengarahkan semua role pengurus ke /admin dan role publik ke panel masing-masing", () => {
    for (const role of STAFF_ROLES) {
      expect(homePathFor(role)).toBe("/admin");
    }
    expect(homePathFor("DONATUR")).toBe("/donatur");
    expect(homePathFor("PENERIMA_BANTUAN")).toBe("/penerima");
  });

  it("membatasi menu sesuai jabatan masing-masing", () => {
    expect(canSeeMenu("BENDAHARA", "donasi")).toBe(true);
    expect(canSeeMenu("BENDAHARA", "donatur")).toBe(true);
    expect(canSeeMenu("BENDAHARA", "program")).toBe(false);
    expect(canSeeMenu("BENDAHARA", "pengurus")).toBe(false);

    expect(canSeeMenu("KETUA", "program")).toBe(true);
    expect(canSeeMenu("KETUA", "penerima")).toBe(true);
    expect(canSeeMenu("KETUA", "donatur")).toBe(false);

    expect(canSeeMenu("BIDANG_SOSIAL", "verifikasi")).toBe(true);
    expect(canSeeMenu("BIDANG_SOSIAL", "pengajuan")).toBe(true);
    expect(can("BIDANG_SOSIAL", "KELOLA_PENYALURAN")).toBe(true);
    expect(can("BIDANG_SOSIAL", "VERIFIKASI_DONASI")).toBe(false);

    expect(canSeeMenu("PENGAWAS", "laporan")).toBe(true);
    expect(canSeeMenu("PENGAWAS", "donasi")).toBe(true);
    expect(can("PENGAWAS", "VERIFIKASI_DONASI")).toBe(false);
  });

  it("memberikan menu awal yang valid untuk setiap jabatan pengurus", () => {
    for (const role of ASSIGNABLE_STAFF_ROLES) {
      const first = firstMenuFor(role);
      expect(canSeeMenu(role, first)).toBe(true);
      expect(ROLE_LABELS[role]).toBeTruthy();
    }
  });
});
