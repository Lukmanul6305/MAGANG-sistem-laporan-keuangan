import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Pastikan ini diimpor jika digunakan

const DaftarTransaksi = ({ isOpen, userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk pencarian dan filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(""); // 'Pemasukan', 'Pengeluaran'
  const [filterCategory, setFilterCategory] = useState(""); // ID Kategori atau Nama
  const [filterMetode, setFilterMetode] = useState(""); // 'cash', 'transfer'

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Jumlah item per halaman
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // State untuk daftar kategori (jika ada filter kategori dropdown)
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // Pastikan useNavigate digunakan jika Anda ingin redirect

  // Fungsi untuk mengambil daftar transaksi dari backend
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint API backend untuk mendapatkan transaksi
      // Kirim userId, halaman, limit, search, dan filter sebagai query parameter
      const response = await axios.get(`http://localhost:5000/api/transaksi/user/${userId}`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          tipe: filterType, // Kolom 'jenis' di frontend = 'tipe' di DB
          kategori: filterCategory, // Kolom 'kategori' di frontend
          metode: filterMetode, // Kolom 'metode' di frontend = 'metode_pembayaran' di DB
        },
      });

      // Struktur respons backend diasumsikan: { data: [...transaksi], totalItems: N, totalPages: M }
      setTransactions(response.data.data.transactions);
      setTotalItems(response.data.data.totalItems);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      console.error("Error fetching transactions:", err.response || err);
      setError("Gagal memuat transaksi. Silakan coba lagi.");
      if (err.response && err.response.status === 401) {
        alert("Sesi Anda berakhir atau Anda belum login. Silakan login kembali.");
        localStorage.removeItem("userId");
        localStorage.removeItem("loggedInUsername");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, itemsPerPage, searchTerm, filterType, filterCategory, filterMetode, navigate]);

  // Fungsi untuk mengambil daftar kategori (opsional, jika ada dropdown filter kategori)
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/kategori`); // Asumsi ada endpoint untuk kategori
      setCategories(response.data.data); // Asumsi respons { data: [{id: 1, nama: 'Makanan'}, ...] }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      // Pastikan userId ada sebelum fetch data
      fetchTransactions();
      fetchCategories(); // Panggil juga fetch categories
    }
  }, [userId, fetchTransactions, fetchCategories]); // Panggil ulang saat userId atau fungsi fetch berubah

  // Handler untuk pencarian
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ke halaman 1 saat pencarian baru
    fetchTransactions();
  };

  // Handler untuk filter
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ke halaman 1 saat filter baru
    fetchTransactions();
  };

  // Handler untuk pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handler untuk aksi edit/hapus (stub)
  const handleEdit = (transactionId) => {
    alert(`Edit transaksi dengan ID: ${transactionId}`);
    // Implementasi logika edit (misal: buka modal form, redirect ke halaman edit)
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus transaksi ini (${transactionId})?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/transaksi/${transactionId}`);
        alert("Transaksi berhasil dihapus!");
        fetchTransactions(); // Refresh daftar setelah hapus
      } catch (err) {
        console.error("Error deleting transaction:", err.response || err);
        alert(`Gagal menghapus transaksi: ${err.response?.data?.message || "Terjadi kesalahan."}`);
      }
    }
  };

  if (loading) return <p className={`p-5 ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>Memuat daftar transaksi...</p>;
  if (error) return <p className={`p-5 text-red-500 ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>{error}</p>;
  if (!userId) return <p className={`p-5 ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>Harap login untuk melihat transaksi.</p>;

  return (
    <div className={`flex flex-col p-5 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"} max-w-full`}>
      <header className="flex w-full h-40 items-center justify-between mb-20">
        <div className="flex flex-col justify-end">
          <h1 className="text-red-700 font-bold text-4xl">Daftar Transaksi</h1>
          <p className="text-xs">Lihat daftar transaksi anda disini</p>
        </div>
      </header>
      <form onSubmit={handleSearchSubmit} className="flex flex-col">
        <div className="flex justify-between mb-5">
          <div>
            <input type="search" placeholder="Cari keterangan, jenis, nominal..." className="text-1xl text-gray-500 border-black border-b-1 mr-3" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button type="submit" className="border p-1 w-20 rounded-sm cursor-pointer">
              Cari
            </button>
          </div>
          {/* Filter Section */}
          <div className="flex gap-2">
            <select
              className="border p-1 rounded-sm"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1); /* handleFilterSubmit(e); */
              }}
            >
              <option value="">Semua Jenis</option>
              <option value="Pemasukan">Pemasukan</option>
              <option value="Pengeluaran">Pengeluaran</option>
            </select>
            <select
              className="border p-1 rounded-sm"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1); /* handleFilterSubmit(e); */
              }}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nama}
                </option>
              ))}
            </select>
            <select
              className="border p-1 rounded-sm"
              value={filterMetode}
              onChange={(e) => {
                setFilterMetode(e.target.value);
                setCurrentPage(1); /* handleFilterSubmit(e); */
              }}
            >
              <option value="">Semua Metode</option>
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
              {/* Tambahkan metode lain jika ada */}
            </select>
            <button onClick={handleFilterSubmit} className="border p-1 w-20 rounded-sm cursor-pointer">
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl 2xl:h-120 bg-gray-100">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Jenis</th>
                <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Kategori</th>
                <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Nominal</th>
                <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Metode</th>
                <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Keterangan</th>
                <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700 w-20">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
                    <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.tipe}</td> {/* 'jenis' dari frontend adalah 'tipe' di DB */}
                    <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.kategori_nama || item.kategori_id}</td> {/* Nama kategori */}
                    <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">Rp {item.jumlah.toLocaleString("id-ID")}</td> {/* Nominal */}
                    <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.metode_pembayaran}</td>
                    <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.deskripsi}</td>
                    <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">
                      <button onClick={() => handleEdit(item.id)} className="text-blue-500 hover:underline mr-2">
                        ✏️
                      </button>
                      <span>|</span>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline ml-2">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                    Tidak ada transaksi ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-5 text-xs flex justify-between items-center">
          <div>Total Transaksi: {totalItems}</div>
          <div className="flex gap-5">
            <button type="button" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading} className="border p-1 px-3 rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              Prev
            </button>
            {/* Tampilkan nomor halaman */}
            {[...Array(totalPages)].map((_, index) => (
              <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={`border p-1 px-3 rounded-sm cursor-pointer ${currentPage === index + 1 ? "bg-blue-500 text-white" : ""}`}>
                {index + 1}
              </button>
            ))}
            <button type="button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || loading} className="border p-1 px-3 rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DaftarTransaksi;
