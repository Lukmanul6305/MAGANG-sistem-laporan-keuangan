import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- TAMBAHKAN IMPOR INI UNTUK FITUR EKSPOR ---
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Impor untuk Chart ---
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// --- Registrasi komponen chart.js ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Helper untuk format Rupiah
const formatRupiah = (number) => {
  if (typeof number !== 'number') number = 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

// Helper untuk mendapatkan tanggal awal dan akhir bulan ini
const getThisMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  return { firstDay, lastDay };
};

const Laporan = ({ isOpen, userId }) => {
  const [summary, setSummary] = useState({ totalSaldo: 0, totalPemasukan: 0, totalPengeluaran: 0 });
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  
  const [filters, setFilters] = useState({
    tipe: 'Semua',
    periode_awal: getThisMonthRange().firstDay,
    periode_akhir: getThisMonthRange().lastDay,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const processTransactions = (transData = []) => {
    let totalPemasukan = 0;
    let totalPengeluaran = 0;
    let runningBalance = 0;
    const validTransData = Array.isArray(transData) ? transData : [];
    
    const processedTransactions = validTransData.map(t => {
      const nominal = Number(t.jumlah !== undefined ? t.jumlah : (t.nominal || 0));
      if (t.jenis === 'Pemasukan' || t.tipe === 'Pemasukan') {
        totalPemasukan += nominal;
        runningBalance += nominal;
      } else {
        totalPengeluaran += nominal;
        runningBalance -= nominal;
      }
      return { ...t, saldoAkhir: runningBalance };
    });

    const newSummary = {
      totalPemasukan,
      totalPengeluaran,
      totalSaldo: totalPemasukan - totalPengeluaran,
    };

    return { processedTransactions, newSummary };
  };

  const handleGenerate = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    const safeDefaultSummary = { totalSaldo: 0, totalPemasukan: 0, totalPengeluaran: 0 };
    const safeDefaultTransactions = [];
    const safeDefaultChartData = [];

    try {
      const queryParams = new URLSearchParams({
        periode_awal: filters.periode_awal,
        periode_akhir: filters.periode_akhir,
        ...(filters.tipe !== 'Semua' && { tipe: filters.tipe })
      }).toString();

      const [summaryRes, transRes, chartRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/laporan/summary/${userId}?${queryParams}`),
        axios.get(`http://localhost:5000/api/laporan/transaksi/${userId}?${queryParams}`),
        axios.get(`http://localhost:5000/api/laporan/chart/weekly/${userId}?${queryParams}`)
      ]);
      
      const transData = transRes.data.payload;
      const chartDataFromApi = chartRes.data.payload;

      if (Array.isArray(transData)) {
        const { processedTransactions, newSummary } = processTransactions(transData);
        setTransactions(processedTransactions);
        setSummary(newSummary);
      } else {
        setTransactions(safeDefaultTransactions);
        setSummary(safeDefaultSummary);
      }
      
      if (Array.isArray(chartDataFromApi)) {
        setChartData(chartDataFromApi);
      } else {
        setChartData(safeDefaultChartData);
      }

    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Gagal memuat data laporan. Silakan coba lagi.");
      setSummary(safeDefaultSummary);
      setTransactions(safeDefaultTransactions);
      setChartData(safeDefaultChartData);
    } finally {
      setLoading(false);
    }
  }, [userId, filters]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleExport = (format) => {
    if (transactions.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    if (format === 'excel') {
      const dataToExport = transactions.map(t => ({
        'Tanggal': new Date(t.tanggal).toLocaleDateString('id-ID'),
        'Jenis': t.jenis || t.tipe,
        'Kategori': t.kategori || t.kategori_nama,
        'Pemasukan': (t.jenis === 'Pemasukan' || t.tipe === 'Pemasukan') ? (t.nominal || t.jumlah) : 0,
        'Pengeluaran': (t.jenis === 'Pengeluaran' || t.tipe === 'Pengeluaran') ? (t.nominal || t.jumlah) : 0,
        'Keterangan': t.keterangan || t.deskripsi,
        'Saldo Akhir': t.saldoAkhir
      }));
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi");
      XLSX.writeFile(workbook, "Laporan_Keuangan.xlsx");
    
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text("Laporan Keuangan", 14, 20);
      doc.setFontSize(10);
      doc.text(`Periode: ${new Date(filters.periode_awal).toLocaleDateString('id-ID')} s/d ${new Date(filters.periode_akhir).toLocaleDateString('id-ID')}`, 14, 26);
      
      // --- PERBAIKAN DI SINI ---
      // Panggil autoTable sebagai fungsi, bukan sebagai method dari doc
      autoTable(doc, {
        startY: 35,
        head: [['No', 'Tanggal', 'Keterangan', 'Kategori', 'Pemasukan', 'Pengeluaran']],
        body: transactions.map((t, index) => [
          index + 1,
          new Date(t.tanggal).toLocaleDateString('id-ID'),
          t.keterangan || t.deskripsi,
          t.kategori || t.kategori_nama,
          (t.jenis === 'Pemasukan' || t.tipe === 'Pemasukan') ? formatRupiah(t.nominal || t.jumlah) : '-',
          (t.jenis === 'Pengeluaran' || t.tipe === 'Pengeluaran') ? formatRupiah(t.nominal || t.jumlah) : '-',
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
      });

      const finalY = doc.lastAutoTable.finalY;
      doc.setFontSize(10);
      doc.text("Ringkasan:", 14, finalY + 10);
      doc.text(`Total Pemasukan: ${formatRupiah(summary.totalPemasukan)}`, 14, finalY + 16);
      doc.text(`Total Pengeluaran: ${formatRupiah(summary.totalPengeluaran)}`, 14, finalY + 22);
      doc.setFont("helvetica", "bold");
      doc.text(`Saldo Akhir: ${formatRupiah(summary.totalSaldo)}`, 14, finalY + 28);

      doc.save("Laporan_Keuangan.pdf");
    }
  };

  const lineChartData = {
    labels: chartData.map((d, index) => `Minggu ${index + 1}`),
    datasets: [
      {
        label: 'Pemasukan',
        data: chartData.map(d => Number(d.total_pemasukan) || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Pengeluaran',
        data: chartData.map(d => Number(d.total_pengeluaran) || 0),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const pieChartData = {
    labels: ['Pengeluaran', 'Pemasukan'],
    datasets: [
      {
        label: 'Jumlah',
        data: [summary?.totalPengeluaran || 0, summary?.totalPemasukan || 0],
        backgroundColor: ['rgb(239, 68, 68)', 'rgb(34, 197, 94)'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  if (!userId) {
    return <div className="p-8 text-center">Memuat data user...</div>;
  }

  return (
    <div className={`flex flex-col p-5 md:p-8 transition-all duration-300 ease-in-out ${isOpen ? " sm:ml-66 ml-45 lg:ml-64" : "lg:ml-20 sm:ml-20 ml-20"}`}>
        {/* ... (Sisa kode JSX tidak perlu diubah) ... */}
         <div>
            <header className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-red-600">Laporan Keuangan</h1>
                <p className="text-gray-500 mt-1">Buat Laporan Mudah cepat dan aman</p>
            </header>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-8 p-4 bg-white rounded-lg shadow">
                <select name="tipe" value={filters.tipe} onChange={handleFilterChange} className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" >
                    <option value="Semua">Semua</option>
                    <option value="Pemasukan">Pemasukan</option>
                    <option value="Pengeluaran">Pengeluaran</option>
                </select>
                <div className="flex items-center gap-2">
                    <input type="date" name="periode_awal" value={filters.periode_awal} onChange={handleFilterChange} className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" />
                    <span className="text-gray-500">-</span>
                    <input type="date" name="periode_akhir" value={filters.periode_akhir} onChange={handleFilterChange} className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <button onClick={handleGenerate} disabled={loading} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors" >
                    {loading ? 'Memuat...' : 'Auto Generate Berhasil'}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500 text-sm">Total Saldo</p>
                    <p className="text-3xl font-bold text-indigo-600 mt-1">{formatRupiah(summary?.totalSaldo)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500 text-sm">Total Pemasukan</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{formatRupiah(summary?.totalPemasukan)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500 text-sm">Total Pengeluaran</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">{formatRupiah(summary?.totalPengeluaran)}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Pemasukan vs Pengeluaran</h3>
                    {chartData.length > 0 ? <Line data={lineChartData} /> : <div className="text-center p-10 text-gray-500">Tidak ada data chart</div>}
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Komposisi Keuangan</h3>
                    <div className="w-full max-w-xs">
                    {(summary?.totalPemasukan > 0 || summary?.totalPengeluaran > 0) ? <Pie data={pieChartData} /> : <div className="text-center p-10 text-gray-500">Tidak ada data</div>}
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="p-3 text-left font-semibold text-gray-700">No</th>
                            <th className="p-3 text-left font-semibold text-gray-700">Tanggal</th>
                            <th className="p-3 text-left font-semibold text-gray-700">Nama Transaksi</th>
                            <th className="p-3 text-left font-semibold text-gray-700">Kategori</th>
                            <th className="p-3 text-left font-semibold text-gray-700">Pemasukan</th>
                            <th className="p-3 text-left font-semibold text-gray-700">Pengeluaran</th>
                            <th className="p-3 text-left font-semibold text-gray-700">Saldo Akhir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="text-center p-6 text-gray-500">Memuat data...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="7" className="text-center p-6 text-red-500">{error}</td></tr>
                        ) : transactions.length > 0 ? (
                            transactions.map((item, index) => (
                            <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-gray-600">{index + 1}</td>
                                <td className="p-3 text-gray-600">{new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                                <td className="p-3 text-gray-800 font-medium">{item.keterangan || item.deskripsi || 'N/A'}</td>
                                <td className="p-3 text-gray-600">{item.kategori || item.kategori_nama}</td>
                                <td className="p-3 text-green-600">
                                  {item.jenis === 'Pemasukan' ? formatRupiah(Number(item.jumlah ?? item.nominal ?? 0)) : '-'}
                                </td>
                                <td className="p-3 text-red-600">
                                  {item.jenis === 'Pengeluaran' ? formatRupiah(Number(item.jumlah ?? item.nominal ?? 0)) : '-'}
                                </td>
                                <td className="p-3 text-gray-800 font-medium">{formatRupiah(item.saldoAkhir)}</td>
                            </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="text-center p-6 text-gray-500">Tidak ada data untuk periode yang dipilih.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-8 gap-4">
                <button onClick={() => handleExport('excel')} className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                    Export Excel
                </button>
                <button onClick={() => handleExport('pdf')} className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors">
                    Export PDF
                </button>
            </div>
        </div>
    </div>
  );
};

export default Laporan;