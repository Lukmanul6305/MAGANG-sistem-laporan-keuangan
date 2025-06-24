import React, { useState, useEffect } from "react";
// Tidak perlu lagi mengimpor useAuth di sini jika userId akan diterima sebagai prop

const Pemasukan = ({ isOpen, userId }) => {
  // userId sekarang diterima sebagai prop
  const [formData, setFormData] = useState({
    tanggal: "",
    tipe: "Pemasukan",
    jumlah: "",
    metode_pembayaran: "",
    nama_kategori: "",
    deskripsi: "",
    // user_id tidak perlu diinisialisasi di sini karena akan didapat dari prop
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Fungsi untuk menampilkan pesan notifikasi
  const showMessage = (msg, success) => {
    setMessage(msg);
    setIsSuccess(success);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // HAPUS useEffect yang mengambil user_id dari localStorage jika ada,
  // atau dari AuthContext jika sebelumnya ada di sini.
  // Sekarang userId akan langsung tersedia dari prop.

  // Tambahkan useEffect untuk validasi awal userId dan jika userId berubah
  useEffect(() => {
    if (!userId) {
      // Ini akan tertangkap di komponen induk yang meneruskan prop
      // Tapi jika ingin ada pesan khusus di komponen ini saat userId tidak ada, bisa ditambahkan
      console.warn("User ID tidak tersedia di komponen Pemasukan.");
      showMessage("Anda belum login. Silakan login terlebih dahulu.", false);
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
        user_id: userId, // Gunakan userId dari prop
      };

      const res = await fetch("http://localhost:5000/api/transaksi/IPemasukan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // PENTING: Untuk mengirim cookie sesi
      });

      const result = await res.json();

      if (res.ok) {
        showMessage("Pemasukan berhasil disimpan!", true);
        // Reset form, user_id tidak perlu direset karena dari prop
        setFormData((prevFormData) => ({
          tanggal: "",
          tipe: "Pemasukan",
          jumlah: "",
          metode_pembayaran: "",
          nama_kategori: "",
          deskripsi: "",
        }));
      } else {
        showMessage(result.message || "Gagal menyimpan pemasukan.", false);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      showMessage("Terjadi kesalahan saat mengirim data ke server.", false);
    }
  };

  // Anda bisa menambahkan loading state berdasarkan prop atau AuthContext dari komponen induk
  // Untuk saat ini, kita asumsikan userId sudah tersedia saat komponen ini dirender,
  // atau komponen induk akan mengarahkan ke login jika userId tidak ada.
  // if (!userId) return null; // Atau tampilkan pesan 'memuat' dari komponen induk

  return (
    <div className={`flex flex-col p-5 md:p-8 transition-all duration-300 ease-in-out ${isOpen ? " sm:ml-66 ml-45 lg:ml-64" : "lg:ml-20 sm:ml-20 ml-20"}`}>
      <header className="flex w-full h-20 justify-between">
        <div className="flex flex-col justify-end">
          <h1 className="text-red-700 font-bold text-4xl">Buat Pemasukan</h1>
          <p className="text-xs">Buat laporan mudah cepat dan aman</p>
        </div>
      </header>

      {/* Area untuk menampilkan pesan notifikasi */}
      {message && <div className={`p-3 my-4 rounded-lg text-white font-medium ${isSuccess ? "bg-green-500" : "bg-red-500"}`}>{message}</div>}
      {/* Akhir area notifikasi */}

      <h1 className="font-bold text-2xl flex w-full h-15 justify-center items-center">Pemasukan Laporan Keuangan</h1>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Tanggal :</label>
          <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} className="border rounded-2xl p-2 text-xs text-gray-500 border-black" required />
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Jenis Transaksi :</label>
          <input type="text" value="Pemasukan" readOnly className="border rounded-2xl p-2 text-xs text-gray-500 border-black bg-gray-100 cursor-not-allowed" />
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Nominal (Rp):</label>
          <input type="number" placeholder="Masukkan nominal" value={formData.jumlah} onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })} className="border rounded-2xl p-2 text-xs text-gray-500 border-black" required />
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Kategori</label>
          <select value={formData.nama_kategori} onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })} className="border rounded-2xl p-2 text-xs text-gray-500 border-black" required>
            <option value="">Pilih Kategori</option>
            <option value="Gaji">Gaji</option>
            <option value="Bonus">Bonus</option>
            <option value="Penjualan">Penjualan</option>
            <option value="Investasi">Investasi</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Metode Pembayaran</label>
          <select value={formData.metode_pembayaran} onChange={(e) => setFormData({ ...formData, metode_pembayaran: e.target.value })} className="border rounded-2xl p-2 text-xs text-gray-500 border-black" required>
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

export default Pemasukan;
