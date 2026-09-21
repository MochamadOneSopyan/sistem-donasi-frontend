import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Nomor WhatsApp Yayasan Mulia Karya Bersama
  const noHp = "6281234567890";

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const encodedText = encodeURIComponent(message);
    const waUrl = `https://wa.me/${noHp}?text=${encodedText}`;
    window.open(waUrl, "_blank");
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Widget Pop-up Chatbot */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header Chat */}
          <div className="bg-emerald-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Layanan Bantuan</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>{" "}
                  Online | Yayasan Mulia Karya Bersama
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Chat / Pesan Otomatis */}
          <div className="p-4 bg-slate-50 space-y-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-gray-100 text-gray-700 shadow-sm leading-relaxed">
              Assalamu'alaikum/Halo! 👋
              <br />
              <br />
              Ada yang bisa kami bantu terkait program infaq, sedekah, atau
              informasi Yayasan Mulia Karya Bersama?
            </div>
          </div>

          {/* Form Input Pesan */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-100 flex gap-2"
          >
            <input
              type="text"
              placeholder="Tulis pesan Anda..."
              className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tombol Floating Floating WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center border-2 border-white"
        title="Hubungi Kami via WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </button>
    </div>
  );
}
