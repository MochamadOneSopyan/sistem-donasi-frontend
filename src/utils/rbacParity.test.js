import { describe, it, expect } from 'vitest';
import { PERMISSION_ROLES, ROLE_GROUPS, ROLE_LABELS, can, canSeeMenu, firstMenuFor } from './roles';
describe('RBAC group policy and navigation for 13 roles', () => {
  it('retains all 13 account roles across the six approved access groups', () => {
    expect(Object.keys(ROLE_GROUPS)).toHaveLength(6);
    expect(Object.keys(ROLE_LABELS)).toHaveLength(13);
    expect(Object.values(ROLE_GROUPS).flat().sort()).toEqual(Object.keys(ROLE_LABELS).sort());
  });
  it('all members share permissions and dashboard navigation within their group', () => {
    const menus = ['verifikasi', 'pengajuan', 'program', 'donasi', 'penerima', 'donatur', 'pengurus', 'laporan', 'profil'];
    for (const roles of Object.values(ROLE_GROUPS)) {
      for (const role of roles) {
        expect(firstMenuFor(role)).toBe(firstMenuFor(roles[0]));
        for (const permission of Object.keys(PERMISSION_ROLES)) expect(can(role, permission)).toBe(can(roles[0], permission));
        for (const menu of menus) expect(canSeeMenu(role, menu)).toBe(canSeeMenu(roles[0], menu));
      }
    }
  });
  for (const role of Object.keys(ROLE_LABELS)) {
    it(`${role}: menu and distinct mutation permissions`, () => {
      const managers = ['ADMIN_SISTEM'];
      const leaders = ['KETUA', 'PENGAWAS', 'PEMBINA'];
      const operations = ['BIDANG_SOSIAL', 'BIDANG_PENDIDIKAN', 'BIDANG_KESEHATAN', 'BIDANG_INFORMATIKA', 'HUMAS'];
      expect(canSeeMenu(role, 'pengurus')).toBe(managers.includes(role));
      expect(can(role, 'user.delete')).toBe(managers.includes(role));
      expect(can(role, 'donation.verify')).toBe([...managers, 'BENDAHARA', 'SEKRETARIS'].includes(role));
      expect(can(role, 'program.delete')).toBe([...managers, ...leaders, ...operations].includes(role));
      expect(can(role, 'assistance.decide')).toBe([...managers, ...leaders, ...operations].includes(role));
      expect(can(role, 'publication.manage')).toBe(false);
      expect(can(role, 'unknown')).toBe(false);
    });
  }
});
