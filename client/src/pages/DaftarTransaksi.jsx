import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DaftarTransaksi = ({ isOpen, userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk pencarian dan filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMetode, setFilterMetode] = useState("");

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fungsi untuk mengambil data utama
  const fetchTransactions = useCallback(async () => {
    if (!userId) return; // Jangan fetch jika tidak ada userId
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/transaksi/user/${userId}`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          tipe: filterType,
          kategori: filterCategory,
          metode: filterMetode,
        },
      });

      // --- KOREKSI PENTING ---
      // Sesuaikan dengan struktur respons backend Anda.
      // Backend mengirim: { data: { transactions: [...], totalItems: N, ... } }
      const responseData = response.data.data;
      setTransactions(responseData.transactions);
      setTotalItems(responseData.totalItems);
      setTotalPages(responseData.totalPages);

    } catch (err) {
      console.error("Error fetching transactions:", err.response || err);
      setError("Gagal memuat transaksi. Silakan coba lagi.");
      if (err.response && err.response.status === 401) {
        alert("Sesi Anda berakhir. Silakan login kembali.");
        localStorage.removeItem("userId");
        localStorage.removeItem("loggedInUsername");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, itemsPerPage, searchTerm, filterType, filterCategory, filterMetode, navigate]);

  // Fungsi untuk mengambil kategori (untuk dropdown filter)
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/kategori`);
      setCategories(response.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);
  
  // useEffect utama untuk memanggil fetchTransactions
  useEffect(() => {
    // Panggil fetchTransactions saat komponen dimuat atau dependensi berubah
    fetchTransactions();
  }, [fetchTransactions]); // fetchTransactions sudah mencakup semua dependensi (filter, search, page)

  // useEffect untuk memanggil fetchCategories sekali saja
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handler untuk form pencarian
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ke halaman 1 saat pencarian baru
    // fetchTransactions akan dipanggil otomatis oleh useEffect
  };
  
  const handleDelete = async (transactionId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus transaksi ini?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/transaksi/${transactionId}`);
        alert("Transaksi berhasil dihapus!");
        // Refresh daftar setelah hapus
        fetchTransactions(); 
      } catch (err) {
        console.error("Error deleting transaction:", err.response || err);
        alert(`Gagal menghapus transaksi: ${err.response?.data?.message || "Terjadi kesalahan."}`);
      }
    }
  };
  
  const handleEdit = (transactionId) => {
    alert(`Fitur edit untuk transaksi ID: ${transactionId} belum diimplementasikan.`);
    // TODO: Implementasi logika edit
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p className={`p-5 ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>Memuat daftar transaksi...</p>;
  if (error) return <p className={`p-5 text-red-500 ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>{error}</p>;
  if (!userId) return <p className={`p-5 ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>Harap login untuk melihat transaksi.</p>;

  return (
    <div className={`flex flex-col p-5 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"} max-w-full`}>
      <header className="flex w-full items-center justify-between mb-8">
        <div>
          <h1 className="text-red-700 font-bold text-4xl">Daftar Transaksi</h1>
          <p className="text-xs">Lihat, cari, dan kelola semua transaksi Anda.</p>
        </div>
      </header>

      {/* Form Pencarian dan Filter */}
      <div className="mb-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-grow">
          <div className="flex">
            <input 
              type="search" 
              placeholder="Cari berdasarkan keterangan..." 
              className="text-gray-500 border-b-2 border-gray-300 focus:border-blue-500 outline-none w-full p-2"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md ml-2 hover:bg-blue-600">
              Cari
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2">
          {/* --- FILTER OTOMATIS --- */}
          <select
            className="border p-2 rounded-md bg-white"
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Semua Jenis</option>
            <option value="Pemasukan">Pemasukan</option>
            <option value="Pengeluaran">Pengeluaran</option>
          </select>
          <select
            className="border p-2 rounded-md bg-white"
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
            ))}
          </select>
          <select
            className="border p-2 rounded-md bg-white"
            value={filterMetode}
            onChange={(e) => { setFilterMetode(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Semua Metode</option>
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Tanggal</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Jenis</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Kategori</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nominal</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Metode</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Keterangan</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border-b">
                  <td className="py-2 px-4 text-sm text-gray-800">{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
                  <td className="py-2 px-4 text-sm text-gray-800">{item.tipe}</td>
                  <td className="py-2 px-4 text-sm text-gray-800">{item.kategori_nama}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${item.tipe === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                    Rp {item.jumlah.toLocaleString("id-ID")}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-800">{item.metode_pembayaran}</td>
                  <td className="py-2 px-4 text-sm text-gray-800">{item.deskripsi}</td>
                  <td className="py-2 px-4 text-center">
                    <button onClick={() => handleEdit(item.id)} className="text-blue-500 hover:underline text-lg mr-3">✏️</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline text-lg">🗑️</button>
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

      {/* Pagination */}
      <div className="p-5 flex justify-between items-center">
        <div className="text-sm text-gray-600">Total Transaksi: <strong>{totalItems}</strong></div>
        <div className="flex gap-2">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading} className="border p-2 px-4 rounded-md cursor-pointer disabled:opacity-50">
            Prev
          </button>
          <span className="p-2">Halaman {currentPage} dari {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || loading} className="border p-2 px-4 rounded-md cursor-pointer disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DaftarTransaksi;