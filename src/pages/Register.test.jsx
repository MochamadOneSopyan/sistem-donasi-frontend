// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {MemoryRouter,Route,Routes,useLocation} from 'react-router-dom';
import Register from './Register';
import API from '../services/api';
vi.mock('../services/api',()=>({default:{post:vi.fn()}}));
afterEach(()=>{cleanup();vi.clearAllMocks();});
function LoginMessage(){return <p>{useLocation().state?.message}</p>;}
it('submits recipient role and shows server confirmation that approval is required',async()=>{
 API.post.mockResolvedValue({data:{message:'Registrasi berhasil! Akun Anda sedang dalam proses verifikasi oleh Admin.'}});
 render(<MemoryRouter initialEntries={['/register']}><Routes><Route path="/register" element={<Register/>}/><Route path="/login" element={<LoginMessage/>}/></Routes></MemoryRouter>);
 fireEvent.click(screen.getByRole('button',{name:'Penerima bantuan'}));
 for(const [label,value] of [['Nama lengkap','Pemohon Uji'],['Alamat email','test@example.invalid'],['Nomor telepon / WhatsApp','08123456789'],['Alamat tempat tinggal','Alamat uji'],['Alasan membutuhkan bantuan','Kebutuhan uji'],['Password','test-password'],['Konfirmasi password','test-password']])fireEvent.change(screen.getByLabelText(label),{target:{value}});
 fireEvent.submit(screen.getByRole('button',{name:'Buat akun'}).closest('form'));
 expect(await screen.findByText(/sedang dalam proses verifikasi oleh Admin/)).toBeTruthy();
 expect(API.post).toHaveBeenCalledWith('/auth/register',expect.objectContaining({role:'PENERIMA_BANTUAN',email:'test@example.invalid'}));
});
