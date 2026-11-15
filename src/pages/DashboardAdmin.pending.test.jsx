// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import DashboardAdmin from './DashboardAdmin';
import API from '../services/api';
vi.mock('../services/api',()=>({default:{get:vi.fn()}}));
afterEach(()=>{cleanup();localStorage.clear();vi.clearAllMocks();});
it('shows queue errors instead of an empty list and refreshes records on focus',async()=>{
 localStorage.setItem('user',JSON.stringify({id:1,role:'KETUA',nama:'Pengurus Uji'}));
 window.scrollTo=vi.fn();
 let fail=true;let pending=[];
 API.get.mockImplementation(async url=>{
  if(url==='/admin/penerima-pending'){
   if(fail)throw {response:{data:{message:'Server antrean tidak tersedia'}}};
   return {data:{data:pending}};
  }
  return {data:{data:url==='/admin/summary-keuangan'?{}:[]}};
 });
 render(<MemoryRouter><DashboardAdmin/></MemoryRouter>);
 fireEvent.click(screen.getByRole('button',{name:/Verifikasi Penerima/}));
 expect(await screen.findByRole('alert')).toBeTruthy();
 expect(screen.queryByText('Tidak ada antrean pendaftaran penerima bantuan saat ini.')).toBeNull();
 fail=false;fireEvent.click(screen.getByRole('button',{name:'Muat ulang antrean'}));
 expect(await screen.findByText('Tidak ada antrean pendaftaran penerima bantuan saat ini.')).toBeTruthy();
 pending=[{id:7,noHp:'000',alamat:'Alamat uji',alasan:'Pengujian',user:{nama:'Pemohon Baru',email:'test@example.invalid'}}];
 fireEvent(window,new Event('focus'));
 expect(await screen.findByText('Pemohon Baru')).toBeTruthy();
});
