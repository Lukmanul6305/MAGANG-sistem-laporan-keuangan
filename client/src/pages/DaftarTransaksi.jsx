import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DaftarTransaksi = ({ isOpen, userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMetode, setFilterMetode] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

const fetchTransactions = useCallback(async () => {
  if (!userId) return;

  setLoading(true);
  setError(null);

  try {
    const res = await axios.get(`http://localhost:5000/api/transaksi/user/${userId}`, {
      params: {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        tipe: filterType,
        kategori: filterCategory,
        metode: filterMetode,
      },
    });

    // Amankan struktur data dari backend
    const result = res.data?.data;

    if (!result) {
      setTransactions([]);
      setTotalItems(0);
      setTotalPages(1);
      setError("Data transaksi tidak ditemukan.");
      return;
    }

    setTransactions(result.transactions || []);
    setTotalItems(result.totalItems || 0);
    setTotalPages(result.totalPages || 1);
  } catch (err) {
    setError("Gagal memuat transaksi. Silakan coba lagi.");
    console.log(err);
    if (err.response?.status === 401) {
      alert("Sesi Anda berakhir. Silakan login kembali.");
      localStorage.clear();
      navigate("/login");
    }
  } finally {
    setLoading(false);
  }
}, [userId, currentPage, searchTerm, filterType, filterCategory, filterMetode, navigate]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/kategori/user/${userId}`);
      setCategories(data.data);
    } catch {
      setCategories([]);
    }
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus transaksi ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/transaksi/${id}`);
      alert("Transaksi berhasil dihapus!");
      fetchTransactions();
    } catch (err) {
      alert("Gagal menghapus transaksi.");
    }
  };

  const handleEdit = (id) => {
    alert(`Edit belum tersedia. ID: ${id}`);
  };

  const changePage = (dir) => {
    setCurrentPage((prev) => {
      const next = prev + dir;
      return next < 1 ? 1 : next > totalPages ? totalPages : next;
    });
  };

  const colClass = "py-3 px-4 text-left text-sm font-semibold text-gray-700";
  const isEmpty = transactions.length === 0;

  if (!userId) return <p className={`p-5 ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>Harap login untuk melihat transaksi.</p>;
  if (loading) return <p className={`p-5 ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>Memuat transaksi...</p>;
  if (error) return <p className={`p-5 text-red-500 ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>{error}</p>;

  return (
    <div className={`flex flex-col p-5 ${isOpen ? "lg:ml-70" : "lg:ml-20"} transition-all max-w-full`}>
      <header className="mb-8">
        <h1 className="text-red-700 font-bold text-4xl">Daftar Transaksi</h1>
        <p className="text-xs">Lihat, cari, dan kelola semua transaksi Anda.</p>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <form onSubmit={handleSearchSubmit} className="flex-grow flex">
          <input
            type="search"
            placeholder="Cari keterangan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500"
          />
          <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Cari</button>
        </form>

        <div className="flex flex-wrap gap-2">
          <select className="border p-2 rounded-md" value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}>
            <option value="">Semua Jenis</option>
            <option value="Pemasukan">Pemasukan</option>
            <option value="Pengeluaran">Pengeluaran</option>
          </select>
          <select className="border p-2 rounded-md" value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}>
            <option value="">Semua Kategori</option>
            {categories.length > 0 ? categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nama_kategori}</option>
            )) : <option disabled>Gagal memuat kategori</option>}
          </select>
          <select className="border p-2 rounded-md" value={filterMetode} onChange={(e) => { setFilterMetode(e.target.value); setCurrentPage(1); }}>
            <option value="">Semua Metode</option>
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className={colClass}>Tanggal</th>
              <th className={colClass}>Jenis</th>
              <th className={colClass}>Kategori</th>
              <th className={colClass}>Nominal</th>
              <th className={colClass}>Metode</th>
              <th className={colClass}>Keterangan</th>
              <th className={`${colClass} text-center`}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {!isEmpty ? transactions.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 text-sm">{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
                <td className="py-2 px-4 text-sm">{item.tipe}</td>
                <td className="py-2 px-4 text-sm">{item.kategori_nama}</td>
                <td className={`py-2 px-4 text-sm font-medium ${item.tipe === "Pemasukan" ? "text-green-600" : "text-red-600"}`}>
                  Rp {item.jumlah.toLocaleString("id-ID")}
                </td>
                <td className="py-2 px-4 text-sm">{item.metode_pembayaran}</td>
                <td className="py-2 px-4 text-sm">{item.deskripsi}</td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => handleEdit(item.id)} className="text-blue-500 hover:underline text-lg mr-3">✏️</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline text-lg">🗑️</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">Tidak ada transaksi ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-5 flex justify-between items-center">
        <span className="text-sm text-gray-600">Total Transaksi: <strong>{totalItems}</strong></span>
        <div className="flex items-center gap-2">
          <button onClick={() => changePage(-1)} disabled={currentPage === 1} className="border px-4 py-2 rounded-md disabled:opacity-50">Prev</button>
          <span>Halaman {currentPage} dari {totalPages}</span>
          <button onClick={() => changePage(1)} disabled={currentPage === totalPages} className="border px-4 py-2 rounded-md disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default DaftarTransaksi;
