import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Menggunakan axios agar seragam
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Helper untuk format Rupiah
const formatRupiah = (number) => {
  if (typeof number !== "number") number = 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Helper untuk format sumbu Y pada chart (misal: 2.000.000 -> 2jt)
const formatYAxis = (tick) => {
  if (tick >= 1000000) {
    return `${tick / 1000000} jt`;
  }
  if (tick >= 1000) {
    return `${tick / 1000}k`;
  }
  return tick;
};

const Dashboard = ({ isOpen }) => {
  const [name, setName] = useState("Pengguna");
  const [summary, setSummary] = useState({ saldo: 0, incomes: 0, expenses: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateTime, setDateTime] = useState(new Date());

  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("loggedInUsername");

    if (storedUserId) {
      setUserId(storedUserId);
      if (storedUsername) setName(storedUsername);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const [saldoRes, incomeRes, expenseRes, bulananRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/transaksi/saldo?user_id=${userId}`),
        axios.get(`http://localhost:5000/api/transaksi/incomes?user_id=${userId}`),
        axios.get(`http://localhost:5000/api/transaksi/expens?user_id=${userId}`),
        axios.get(`http://localhost:5000/api/transaksi/bulanan?user_id=${userId}`),
      ]);

      setSummary({
        saldo: Number(saldoRes.data?.total_saldo) || 0,
        incomes: Number(incomeRes.data?.total_pemasukan) || 0,
        expenses: Number(expenseRes.data?.total_pengeluaran) || 0,
      });

      setMonthlyData(bulananRes.data || []);
    } catch (err) {
      console.error("Gagal fetch data dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Data untuk Line Chart (Grafik Bulanan)
  const lineChartData = monthlyData.map((item) => {
    const bulanFormat = new Date(item.bulan + "-01").toLocaleString("id-ID", { month: "short" });
    return {
      bulan: bulanFormat,
      // Gunakan Number() untuk memastikan datanya adalah angka
      Pemasukan: Number(item.total_pemasukan) || 0,
      Pengeluaran: Number(item.total_pengeluaran) || 0,
    };
  });

  // Data untuk Pie Chart
  const pieChartData = [
    { name: "Pemasukan", value: summary.incomes },
    { name: "Pengeluaran", value: summary.expenses },
  ];
  const PIE_COLORS = ["#2563EB", "#DC2626"];

  if (loading) {
    return <p className="p-10 text-center">Memuat data dashboard...</p>;
  }

  return (
    <div className={`flex flex-col p-5 md:p-8 transition-all duration-300 ease-in-out ${isOpen ? " sm:ml-66 ml-45 lg:ml-64" : "lg:ml-20 sm:ml-20 ml-20"}`}>
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-red-800">Dashboard</h1>
          <p className="text-xs text-gray-500">
            {dateTime.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} | {dateTime.toLocaleTimeString("id-ID")}
          </p>
        </div>
        <div className="mt-4 mr-10 sm:mt-0 text-right">
          <p className="text-lg text-gray-600">Selamat Datang,</p>
          <h2 className="text-2xl font-bold text-blue-600">{name}</h2>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <h3 className="text-blue-500 font-semibold">Total Pemasukan</h3>
          <p className="text-3xl font-bold text-blue-800 mt-2">{formatRupiah(summary.incomes)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
          <h3 className="text-red-500 font-semibold">Total Pengeluaran</h3>
          <p className="text-3xl font-bold text-red-800 mt-2">{formatRupiah(summary.expenses)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 className="text-blue-500 font-semibold">Saldo Akhir</h3>
          <p className="text-3xl font-bold text-blue-500 mt-2">{formatRupiah(summary.saldo)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Grafik Bulanan (Line Chart) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Grafik Pemasukan vs Pengeluaran Bulanan</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="bulan" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={formatYAxis} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatRupiah(value)} />
                <Legend />
                <defs>
                  <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="Pemasukan" stroke="#2563EB" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Pengeluaran" stroke="#DC2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Komposisi Keuangan (Pie Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Komposisi Keuangan</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatRupiah(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
