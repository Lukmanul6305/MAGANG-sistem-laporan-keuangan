import { useState } from "react";

const Pengeluaran = ({ isOpen }) => {
  const [formData, setFormData] = useState({
    tanggal: "",
    tipe: "Pengeluaran",
    jumlah: "",
    nama_kategori: "",
    metode_pembayaran: "",
    deskripsi: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/transaksi/IPengeluaran", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Pengeluaran berhasil disimpan!");
        setFormData({
          tanggal: "",
          tipe: "Pengeluaran",
          jumlah: "",
          nama_kategori: "",
          metode_pembayaran: "",
          deskripsi: "",
        });
      } else {
        alert(result.message || "Gagal menyimpan pengeluaran.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  return (
    <div className={`flex flex-col p-5 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"} max-w-full`}>
      <header className="flex w-full h-20 justify-between">
        <div className="flex flex-col justify-end">
          <h1 className="text-red-700 font-bold text-4xl">Buat Pengeluaran</h1>
          <p className="text-xs">Buat laporan mudah cepat dan aman</p>
        </div>
      </header>
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
