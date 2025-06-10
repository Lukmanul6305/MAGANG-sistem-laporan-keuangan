// import { useState } from "react";

// const Pemasukan = ({ isOpen }) => {
//   const [formData, setFormData] = useState({
//     tanggal: "",
//     tipe: "Pemasukan",
//     jumlah: "",
//     metode_pembayaran: "",
//     nama_kategori: "",
//     deskripsi: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token"); // ✅ Ambil token dari localStorage

//     if (!token) {
//       alert("Token tidak ditemukan. Silakan login terlebih dahulu.");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/transaksi/IPemasukan", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // ✅ Gunakan token di header
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         alert("Pemasukan berhasil disimpan!");
//         setFormData({
//           tanggal: "",
//           tipe: "Pemasukan",
//           jumlah: "",
//           metode_pembayaran: "",
//           nama_kategori: "",
//           deskripsi: "",
//         });
//       } else {
//         alert(result.message || "Gagal menyimpan pemasukan.");
//       }
//     } catch (error) {
//       console.error("Terjadi kesalahan:", error);
//       alert("Terjadi kesalahan saat mengirim data ke server.");
//     }
//   };

//   return (
//     <div
//       className={`flex flex-col p-5 transition-all duration-300 ease-in-out ${
//         isOpen ? "lg:ml-70" : "lg:ml-20"
//       } max-w-full`}
//     >
//       <header className="flex w-full h-20 justify-between">
//         <div className="flex flex-col justify-end">
//           <h1 className="text-red-700 font-bold text-4xl">Buat Pemasukan</h1>
//           <p className="text-xs">Buat laporan mudah cepat dan aman</p>
//         </div>
//       </header>
//       <h1 className="font-bold text-2xl flex w-full h-15 justify-center items-center">
//         Pemasukan Laporan Keuangan
//       </h1>
//       <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
//         <div className="flex flex-col">
//           <label className="p-1 text-lg">Tanggal :</label>
//           <input
//             type="date"
//             value={formData.tanggal}
//             onChange={(e) =>
//               setFormData({ ...formData, tanggal: e.target.value })
//             }
//             className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
//             required
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="p-1 text-lg">Jenis Transaksi :</label>
//           <input
//             type="text"
//             value="Pemasukan"
//             readOnly
//             className="border rounded-2xl p-2 text-xs text-gray-500 border-black bg-gray-100 cursor-not-allowed"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="p-1 text-lg">Nominal (Rp):</label>
//           <input
//             type="number"
//             placeholder="Masukkan nominal"
//             value={formData.jumlah}
//             onChange={(e) =>
//               setFormData({ ...formData, jumlah: e.target.value })
//             }
//             className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
//             required
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="p-1 text-lg">Kategori</label>
//           <select
//             value={formData.nama_kategori}
//             onChange={(e) =>
//               setFormData({ ...formData, nama_kategori: e.target.value })
//             }
//             className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
//             required
//           >
//             <option value="">Pilih Kategori</option>
//             <option value="Gaji">Gaji</option>
//             <option value="Bonus">Bonus</option>
//             <option value="Penjualan">Penjualan</option>
//             <option value="Investasi">Investasi</option>
//             <option value="Lainnya">Lainnya</option>
//           </select>
//         </div>
//         <div className="flex flex-col">
//           <label className="p-1 text-lg">Metode Pembayaran</label>
//           <select
//             value={formData.metode_pembayaran}
//             onChange={(e) =>
//               setFormData({ ...formData, metode_pembayaran: e.target.value })
//             }
//             className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
//             required
//           >
//             <option value="">Pilih Metode</option>
//             <option value="Transfer Bank">Transfer Bank</option>
//             <option value="Tunai">Tunai</option>
//             <option value="E-Wallet">E-Wallet</option>
//             <option value="QRIS">QRIS</option>
//           </select>
//         </div>
//         <div className="flex flex-col">
//           <label className="p-1 text-lg">Deskripsi</label>
//           <input
//             type="text"
//             placeholder="Tambahkan deskripsi (opsional)"
//             value={formData.deskripsi}
//             onChange={(e) =>
//               setFormData({ ...formData, deskripsi: e.target.value })
//             }
//             className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
//           />
//         </div>
//         <div className="w-full flex justify-end items-end h-20">
//           <button
//             type="submit"
//             className="bg-blue-600 p-2 w-30 rounded-2xl text-white font-bold cursor-pointer"
//           >
//             Buat
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Pemasukan;

import React, { useState, useEffect } from "react";

const Pemasukan = ({ isOpen }) => {
  const [formData, setFormData] = useState({
    tanggal: "",
    tipe: "Pemasukan",
    jumlah: "",
    metode_pembayaran: "",
    nama_kategori: "",
    deskripsi: "",
    user_id: null, // Tambahkan user_id ke state awal
  });
  const [message, setMessage] = useState(""); // State untuk pesan notifikasi
  const [isSuccess, setIsSuccess] = useState(false); // State untuk tipe pesan (sukses/gagal)

  // Ambil user_id dari localStorage saat komponen dimuat
  useEffect(() => {
    const storedUserId = localStorage.getItem('loggedInUserId');
    if (storedUserId) {
      setFormData(prevFormData => ({
        ...prevFormData,
        user_id: storedUserId,
      }));
    } else {
      // Jika user_id tidak ditemukan, mungkin tampilkan pesan atau arahkan ke login
      showMessage("ID Pengguna tidak ditemukan. Silakan login kembali.", false);
    }
  }, []);

  // Fungsi untuk menampilkan pesan notifikasi
  const showMessage = (msg, success) => {
    setMessage(msg);
    setIsSuccess(success);
    // Sembunyikan pesan setelah beberapa detik
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sisi klien dasar sebelum mengirim
    if (!formData.tanggal || !formData.jumlah || !formData.nama_kategori || !formData.metode_pembayaran || !formData.user_id) {
        showMessage("Semua field wajib diisi (kecuali deskripsi).", false);
        return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/transaksi/IPemasukan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // formData sekarang sudah termasuk user_id
      });

      const result = await res.json();

      if (res.ok) {
        showMessage("Pemasukan berhasil disimpan!", true); // Tampilkan pesan sukses
        // Reset form, tapi pertahankan user_id jika perlu
        setFormData(prevFormData => ({
          tanggal: "",
          tipe: "Pemasukan",
          jumlah: "",
          metode_pembayaran: "",
          nama_kategori: "",
          deskripsi: "",
          user_id: prevFormData.user_id, // Pertahankan user_id yang sudah ada
        }));
      } else {
        showMessage(result.message || "Gagal menyimpan pemasukan.", false); // Tampilkan pesan gagal
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      showMessage("Terjadi kesalahan saat mengirim data ke server.", false); // Tampilkan pesan error umum
    }
  };

  return (
    <div
      className={`flex flex-col p-5 transition-all duration-300 ease-in-out ${
        isOpen ? "lg:ml-70" : "lg:ml-20"
      } max-w-full`}
    >
      <header className="flex w-full h-20 justify-between">
        <div className="flex flex-col justify-end">
          <h1 className="text-red-700 font-bold text-4xl">Buat Pemasukan</h1>
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
        Pemasukan Laporan Keuangan
      </h1>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Tanggal :</label>
          <input
            type="date"
            value={formData.tanggal}
            onChange={(e) =>
              setFormData({ ...formData, tanggal: e.target.value })
            }
            className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Jenis Transaksi :</label>
          <input
            type="text"
            value="Pemasukan"
            readOnly
            className="border rounded-2xl p-2 text-xs text-gray-500 border-black bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Nominal (Rp):</label>
          <input
            type="number"
            placeholder="Masukkan nominal"
            value={formData.jumlah}
            onChange={(e) =>
              setFormData({ ...formData, jumlah: e.target.value })
            }
            className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="p-1 text-lg">Kategori</label>
          <select
            value={formData.nama_kategori}
            onChange={(e) =>
              setFormData({ ...formData, nama_kategori: e.target.value })
            }
            className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
            required
          >
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
          <select
            value={formData.metode_pembayaran}
            onChange={(e) =>
              setFormData({ ...formData, metode_pembayaran: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, deskripsi: e.target.value })
            }
            className="border rounded-2xl p-2 text-xs text-gray-500 border-black"
          />
        </div>
        <div className="w-full flex justify-end items-end h-20">
          <button
            type="submit"
            className="bg-blue-600 p-2 w-30 rounded-2xl text-white font-bold cursor-pointer"
          >
            Buat
          </button>
        </div>
      </form>
    </div>
  );
};

export default Pemasukan;
