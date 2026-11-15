// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import API from '../services/api';
import { STAFF_ROLES, ROLE_LABELS, homePathFor } from '../utils/roles';
vi.mock('../services/api', () => ({ default: { get: vi.fn() } }));
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
afterEach(cleanup);
function mount(path, roles, permission) {
  return render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path={path} element={<ProtectedRoute roles={roles} permission={permission}><div>Private dashboard</div></ProtectedRoute>} />
    <Route path="/login" element={<div>Login required</div>} />
    <Route path="/unauthorized" element={<div>Access denied</div>} />
  </Routes></MemoryRouter>);
}
describe('server-validated dashboard routes for all 13 roles', () => {
  for (const role of Object.keys(ROLE_LABELS)) {
    it(`${role}: allows own dashboard and denies another role's dashboard`, async () => {
      localStorage.setItem('token', 'opaque-server-verified-token');
      localStorage.setItem('user', JSON.stringify({ role: 'ADMIN_SISTEM' }));
      API.get.mockResolvedValue({ data: { data: { id: 7, role, permissions: [] } } });
      const allowed = STAFF_ROLES.includes(role) ? STAFF_ROLES : [role];
      mount(homePathFor(role), allowed);
      expect(await screen.findByText('Private dashboard')).toBeTruthy();
      expect(JSON.parse(localStorage.getItem('user')).role).toBe(role);
      cleanup();
      mount('/other-dashboard', role === 'DONATUR' ? ['PENERIMA_BANTUAN'] : ['DONATUR']);
      expect(await screen.findByText('Access denied')).toBeTruthy();
    });
  }
  it('guest is sent to login without fetching private data', async () => {
    mount('/admin', STAFF_ROLES);
    expect(await screen.findByText('Login required')).toBeTruthy();
    expect(API.get).not.toHaveBeenCalled();
  });
  it('401 is sent to login; missing server permission denies access', async () => {
    localStorage.setItem('token', 'expired');
    API.get.mockRejectedValue({ response: { status: 401 } });
    mount('/admin', STAFF_ROLES);
    expect(await screen.findByText('Login required')).toBeTruthy();
    cleanup();
    API.get.mockResolvedValue({ data: { data: { role: 'SEKRETARIS', permissions: ['assistance.view'] } } });
    mount('/admin', STAFF_ROLES, 'user.create');
    expect(await screen.findByText('Access denied')).toBeTruthy();
  });
  it('database/server failure never mounts the dashboard', async () => {
    localStorage.setItem('token', 'token'); API.get.mockRejectedValue(new Error('offline'));
    mount('/admin', STAFF_ROLES);
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.queryByText('Private dashboard')).toBeNull();
  });
});
