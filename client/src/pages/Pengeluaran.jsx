import React, { useState, useEffect } from "react";
// Tidak perlu mengimpor useAuth di sini karena userId akan diterima sebagai prop

const Pengeluaran = ({ isOpen, userId }) => { // userId diterima sebagai prop
  const [formData, setFormData] = useState({
    tanggal: "",
    tipe: "Pengeluaran", // Tipe transaksi sudah pasti "Pengeluaran"
    jumlah: "",
    nama_kategori: "",
    metode_pembayaran: "",
    deskripsi: "",
    // user_id tidak perlu diinisialisasi di sini karena akan didapat dari prop
  });
  const [message, setMessage] = useState(""); // State untuk pesan notifikasi
  const [isSuccess, setIsSuccess] = useState(false); // State untuk tipe pesan (sukses/gagal)

  // Fungsi untuk menampilkan pesan notifikasi
  const showMessage = (msg, success) => {
    setMessage(msg);
    setIsSuccess(success);
    // Sembunyikan pesan setelah beberapa detik
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // Validasi awal userId dan jika userId berubah
  useEffect(() => {
    if (!userId) {
      console.warn("User ID tidak tersedia di komponen Pengeluaran. Mengarahkan ke halaman login.");
      showMessage("Anda belum login. Silakan login terlebih dahulu.", false);
      // Anda mungkin ingin menambahkan redirect di sini jika tidak ditangani di App.jsx
      // Contoh: navigate('/login');
    }
  }, [userId]); // Dependensi userId agar efek ini berjalan jika userId berubah

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi dasar, termasuk user_id dari prop
    if (!formData.tanggal || !formData.jumlah || !formData.nama_kategori || !formData.metode_pembayaran || !userId) {
      showMessage("Semua field wajib diisi (kecuali deskripsi) dan Anda harus login.", false);
      return;
    }

    try {
      const payload = {
        ...formData,
        user_id: userId, // Gunakan userId dari prop untuk dikirim ke backend
      };

      const res = await fetch("http://localhost:5000/api/transaksi/IPengeluaran", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Hapus header Authorization dengan token lama
          // Authorization: Bearer ${token},
        },
        credentials: 'include', // PENTING: Untuk mengirim cookie sesi ke backend
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        showMessage("Pengeluaran berhasil disimpan!", true); // Tampilkan pesan sukses
        // Reset form, user_id tidak perlu direset karena dari prop
        setFormData(prevFormData => ({
          tanggal: "",
          tipe: "Pengeluaran",
          jumlah: "",
          nama_kategori: "",
          metode_pembayaran: "",
          deskripsi: "",
        }));
      } else {
        showMessage(result.message || "Gagal menyimpan pengeluaran.", false); // Tampilkan pesan gagal dari backend
      }
    } catch (err) {
      console.error("Error:", err);
      showMessage("Terjadi kesalahan saat mengirim data.", false); // Tampilkan pesan error umum
    }
  };

  return (
    <div
      className={`flex flex-col p-5 md:p-8 transition-all duration-300 ease-in-out ${isOpen ? " sm:ml-66 ml-45 lg:ml-64" : "lg:ml-20 sm:ml-20 ml-20"}`}
    >
      <header className="flex w-full h-20 justify-between">
        <div className="flex flex-col justify-end">
          <h1 className="text-red-700 font-bold text-4xl">Buat Pengeluaran</h1>
          <p className="text-xs">Buat laporan mudah cepat dan aman</p>
        </div>
      </header>

      {/* Area untuk menampilkan pesan notifikasi */}
      {message && (
        <div className={`p-3 my-4 rounded-lg text-white font-medium ${isSuccess ? "bg-green-500" : "bg-red-500"}`}>
          {message}
        </div>
      )}
      {/* Akhir area notifikasi */}

      <h1 className="font-bold text-2xl flex w-full h-15 justify-center items-center">
        Pengeluaran Laporan Keuangan
      </h1>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Tanggal :</label>
          <input
            type="date"
            value={formData.tanggal}
            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
            className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Jenis Transaksi :</label>
          <input
            type="text"
            value="Pengeluaran"
            readOnly
            className="border rounded-2xl p-2 text-xs text-gray-500 border-black bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Nominal (Rp):</label>
          <input
            type="number"
            placeholder="Masukkan Nominal"
            value={formData.jumlah}
            onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
            className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Kategori</label>
          <select
            value={formData.nama_kategori}
            onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })}
            className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
            required
          >
            <option value="">Pilih Kategori</option>
            <option value="Makan & Minum">Makan & Minum</option>
            <option value="Transportasi">Transportasi</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Hiburan">Hiburan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Metode Pembayaran</label>
          <select
            value={formData.metode_pembayaran}
            onChange={(e) => setFormData({ ...formData, metode_pembayaran: e.target.value })}
            className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
            required
          >
            <option value="">Pilih Metode</option>
            <option value="Transfer Bank">Transfer Bank</option>
            <option value="Tunai">Tunai</option>
            <option value="E-Wallet">E-Wallet</option>
            <option value="QRIS">QRIS</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Deskripsi</label>
          <input
            type="text"
            placeholder="Tambahkan deskripsi (opsional)"
            value={formData.deskripsi}
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
            className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
          />
        </div>
        <div className="w-full flex justify-end items-end h-20">
          <button type="submit" className="bg-blue-600 p-2 w-30 rounded-2xl text-white font-bold cursor-pointer">
            Buat
          </button>
        </div>
      </form>
    </div>
  );
};

export default Pengeluaran;
