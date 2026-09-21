import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import logoYayasan from "../assets/logo-yayasan.jpeg";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-12 pb-6 border-t border-emerald-900 font-sans">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img
              src={logoYayasan}
              alt="Yayasan Mulia Karya Bersama"
              className="w-10 h-10 bg-white p-0.5 rounded-full object-contain"
            />
            <span className="font-extrabold text-white text-base">
              Yayasan Mulia Karya Bersama
            </span>
          </div>
          <p className="text-xs text-emerald-300 leading-relaxed">
            Lembaga sosial dan pendidikan keagamaan yang berkomitmen mewujudkan
            kepedulian sosial, pendidikan Al-Qur'an, serta pemberdayaan yatim
            dan dhuafa.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-amber-400 text-sm">Alamat & Kontak</h4>
          <ul className="space-y-2 text-xs text-emerald-200">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Tangerang, Banten, Indonesia</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>+62 812-3456-7890</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>info@muliakaryabersama.or.id</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-amber-400 text-sm">
            Rekening Donasi Resmi
          </h4>
          <p className="text-xs text-emerald-300">
            Salurkan infaq dan sedekah terbaik Anda melalui rekening resmi:
          </p>
          <div className="bg-emerald-900/60 p-3 rounded-lg border border-emerald-800 space-y-1 text-xs">
            <div className="flex justify-between font-mono text-white">
              <span>BSI (Bank Syariah Indonesia)</span>
              <span className="font-bold text-amber-400">712 3456 789</span>
            </div>
            <p className="text-[10px] text-emerald-400 pt-1">
              a.n. Yayasan Mulia Karya Bersama
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4 border-t border-emerald-900 text-center text-xs text-emerald-400">
        © {new Date().getFullYear()} Yayasan Mulia Karya Bersama. All rights
        reserved.
      </div>
    </footer>
  );
}
