// const Laporan = ({ isOpen }) => {
//   const data = [
//     { id: 1, tanggal: "2025-05-05", jenis: "Produk A", kategori: 150, nominal: "Rp 50.000", metode: "cash", keterangan: "misal gaji", aksi: ["✏️", "|", "🗑️"] },
//     { id: 2, tanggal: "2025-05-05", jenis: "Produk B", kategori: 80, nominal: "Rp 75.000", metode: "cash", keterangan: "misal gaji", aksi: ["✏️", "|", "🗑️"] },
//     { id: 3, tanggal: "2025-05-05", jenis: "Produk C", kategori: 200, nominal: "Rp 30.000", metode: "cash", keterangan: "misal gaji", aksi: ["✏️", "|", "🗑️"] },
//     { id: 4, tanggal: "2025-05-05", jenis: "Produk D", kategori: 45, nominal: "Rp 120.000", metode: "cash", keterangan: "misal gaji", aksi: ["✏️", "|", "🗑️"] },
//   ];

//   return (
//     <div className={`flex flex-col p-5 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"} max-w-full`}>
//       <header className="flex w-full h-20 justify-between">
//         <div className="flex flex-col justify-end">
//           <h1 className="text-red-700 font-bold text-4xl">Laporan Transaksi</h1>
//           <p className="text-xs">Lihat daftar transaksi anda disini</p>
//         </div>
//       </header>

//       <form className="flex flex-col">
//         <div className="flex gap-2 justify-center p-10">
//           <button className="flex justify-between p-1 border rounded-sm w-20 h-8 items-center text-xs"><span>Semua</span>V</button>
//           <input type="date" className="border rounded-sm w-30 p-1 h-8 items-center text-xs" />
//           <button className="border rounded-sm w-20 h-8 items-center text-xs">Generate</button>
//         </div>

//         <div className="w-full flex justify-center p-4">
//           <div className="flex justify-center gap-4 h-30 w-[90%]">
//             <div className="border border-white shadow-sm rounded-lg flex flex-col font-bold text-blue-500 text-xs w-full items-center justify-center gap-1">
//               <span className="text-2xl p-2">Rp.uanggggggggggggggggg</span>Total Saldo
//             </div>
//             <div className="border border-white shadow-sm rounded-lg flex flex-col font-bold text-blue-500 text-xs w-full items-center justify-center gap-1">
//               <span className="text-2xl p-2">Rp.uang</span>Total Pemasukan
//             </div>
//             <div className="border border-white shadow-sm rounded-lg flex flex-col font-bold text-blue-500 text-xs w-full items-center justify-center gap-1">
//               <span className="text-2xl p-2">Rp.uang</span>Total Pengeluaran
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto rounded-2xl 2xl:h-100 bg-gray-100">
//           <table className="min-w-full border border-gray-300">
//             <thead>
//               <tr>
//                 <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Tanggal</th>
//                 <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Jenis</th>
//                 <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Kategori</th>
//                 <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Nominal</th>
//                 <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Metode</th>
//                 <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Keterangan</th>
//                 <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700 w-20">Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item) => (
//                 <tr key={item.id} className="bg-white hover:bg-gray-50">
//                   <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.tanggal}</td>
//                   <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.jenis}</td>
//                   <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.kategori}</td>
//                   <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.nominal}</td>
//                   <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.metode}</td>
//                   <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.keterangan}</td>
//                   <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">
//                     <div className="flex gap-1">
//                       {item.aksi.map((icon, index) => (
//                         <span key={index} className="cursor-pointer">{icon}</span>
//                       ))}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="w-full flex justify-end items-end h-20">
//           <button className="bg-blue-600 p-2 w-30 rounded-2xl text-white font-bold cursor-pointer">Export</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Laporan;

import React, { useEffect, useState } from "react";
import axios from "axios";

const Laporan = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/transaksi/user/${userId}`);
        setTransactions(res.data.data);
      } catch (err) {
        console.error("Error ambil data:", err);
        setTransactions([]);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Daftar Transaksi</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Tanggal</th>
            <th className="border px-2 py-1">Tipe</th>
            <th className="border px-2 py-1">Kategori</th>
            <th className="border px-2 py-1">Jumlah</th>
            <th className="border px-2 py-1">Metode</th>
            <th className="border px-2 py-1">Deskripsi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-2">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            transactions.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.tanggal}</td>
                <td className="border px-2 py-1">{item.tipe}</td>
                <td className="border px-2 py-1">{item.kategori_nama}</td>
                <td className="border px-2 py-1">{item.jumlah}</td>
                <td className="border px-2 py-1">{item.metode_pembayaran}</td>
                <td className="border px-2 py-1">{item.deskripsi}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Laporan;
