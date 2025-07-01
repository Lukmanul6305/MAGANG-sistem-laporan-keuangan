import React from "react";
import { motion } from "framer-motion";

export default function Homepage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center p-4 shadow bg-white"
      >
        <div className="text-2xl font-bold text-blue-700">
          <span className="text-red-600">$</span>LAKU
        </div>
        <div className="space-x-4 text-sm md:space-x-6 md:text-base">
          <a href="#fitur" className="hover:underline text-gray-700">Fitur</a>
          <a href="#tentang" className="hover:underline text-gray-700">Tentang</a>
          <a href="/login" className="text-blue-700 font-semibold">Login</a>
          <a href="/register" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Daftar</a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-20 bg-blue-100 px-4"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blue-900">Kelola Keuangan Anda dengan Mudah & Cepat</h1>
        <p className="text-base md:text-lg mb-6">Sistem laporan keuangan gratis dan praktis untuk semua.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <motion.a
            whileHover={{ scale: 1.05 }}
            className="bg-red-600 text-white px-6 py-3 rounded font-semibold"
            href="/register"
          >
            Mulai Sekarang
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            className="border border-red-600 text-red-600 px-6 py-3 rounded font-semibold hover:bg-red-100"
            href="#fitur"
          >
            Demo Gratis
          </motion.a>
        </div>
      </motion.section>

      {/* Fitur Utama */}
      <motion.section
        id="fitur"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
        className="py-16 px-4 md:px-6 bg-white"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-center mb-10 text-blue-800"
        >
          Fitur Unggulan SILAKU
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { icon: "report-card", text: "Laporan Keuangan Otomatis" },
            { icon: "edit-file", text: "Input Transaksi Harian" },
            { icon: "export", text: "Ekspor Data CSV / Excel" },
            { icon: "combo-chart", text: "Grafik & Visualisasi Keuangan" },
            { icon: "budget", text: "Pengelolaan Anggaran" },
            { icon: "calendar", text: "Laporan Bulanan" },
            { icon: "calendar-13", text: "Laporan Harian" },
            { icon: "calendar-7", text: "Laporan Mingguan" },
          ].map((fitur, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <img
                src={`https://img.icons8.com/ios/50/${fitur.icon}.png`}
                alt={fitur.text}
                className="mx-auto"
              />
              <p className="mt-2 font-semibold">{fitur.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tentang / Kelebihan */}
      <motion.section
        id="tentang"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 md:px-6 bg-blue-50 text-center"
      >
        <h2 className="text-2xl font-bold mb-6 text-red-700">Kenapa Memilih SILAKU?</h2>
        <motion.ul
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-left list-disc space-y-3 text-gray-700"
        >
          <li>100% Gratis untuk digunakan tanpa batasan waktu</li>
          <li>Tampilan simpel, cocok untuk UMKM dan individu</li>
          <li>Dibuka lewat browser, tidak perlu install</li>
          <li>Aman dengan sistem login dan hak akses</li>
          <li>Mudah digunakan tanpa pengalaman akuntansi</li>
          <li>Dukungan teknis dan update rutin</li>
          <li>Privasi data terjaga dengan enkripsi</li>
          <li>Bisa diakses dari berbagai perangkat</li>
        </motion.ul>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-gray-800 text-white text-center p-6"
      >
        <div className="space-x-4 text-sm">
          <a href="#" className="hover:underline">FAQ</a>
          <a href="#" className="hover:underline">Kebijakan Privasi</a>
          <a href="#" className="hover:underline">Syarat & Ketentuan</a>
        </div>
        <p className="mt-4 text-sm">&copy; 2025 SILAKU. Semua Hak Dilindungi.</p>
      </motion.footer>
    </div>
  );
}
