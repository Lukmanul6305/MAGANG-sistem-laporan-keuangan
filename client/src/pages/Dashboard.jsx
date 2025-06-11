import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = ({ isOpen, userId }) => {
  const [name, setName] = useState("Pengguna");
  const [saldo, setSaldo] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [incomes, setIncomes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bulanan, setBulanan] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUsername");
    if (storedUsername) {
      setName(storedUsername);
    }

    if (!userId) {
      console.warn("User ID tidak tersedia. Mengarahkan ke halaman login.");
      navigate("/login");
      return;
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [saldoRes, incomeRes, expenseRes, bulananRes] = await Promise.all([
          fetch(`http://localhost:5000/api/transaksi/saldo?user_id=${userId}`).then((res) => res.json()),
          fetch(`http://localhost:5000/api/transaksi/incomes?user_id=${userId}`).then((res) => res.json()),
          fetch(`http://localhost:5000/api/transaksi/expens?user_id=${userId}`).then((res) => res.json()), // Perhatikan 'expens' mungkin typo, seharusnya 'expenses'
          fetch(`http://localhost:5000/api/transaksi/bulanan?user_id=${userId}`).then((res) => res.json()),
        ]);

        setSaldo(saldoRes.total_saldo || 0);
        setIncomes(incomeRes.total_pemasukan || 0);
        setExpenses(expenseRes.total_pengeluaran || 0);
        setBulanan(bulananRes || []);
      } catch (err) {
        console.error("Gagal fetch data transaksi:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const data = bulanan.map((item) => {
    const bulanFormat = new Date(item.bulan + "-01").toLocaleString("id-ID", {
      month: "short",
    });
    return {
      bulan: bulanFormat,
      pemasukan: item.total_pemasukan,
      pengeluaran: item.total_pengeluaran,
    };
  });

  // Data untuk Pie Chart
  const pieChartData = [
    { name: "Pemasukan", value: incomes },
    { name: "Pengeluaran", value: expenses },
  ];

  // Warna untuk Pie Chart
  const PIE_COLORS = ["#2563EB", "#DC2626"]; // Biru untuk Pemasukan, Merah untuk Pengeluaran

  if (loading && userId) return <p className="p-10">Memuat...</p>;
  if (!userId) return null; // Atau tampilkan loading/pesan singkat sebelum redirect

  return (
    <div>
      <div className={`flex flex-col p-5 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>
        <header className="flex flex-col w-full h-50 justify-between">
          <div className="flex flex-col items-start justify-center h-full">
            <h1 className="text-red-700 font-bold text-5xl">Dashboard</h1>
            <p className="text-xs">{dateTime.toLocaleString("id-ID")}</p>
          </div>
          <div>
            <h1 className="flex flex-col font-bold text-3xl text-blue-600">
              Hallo <span className="text-2xl">{name}</span>
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-2 grid-rows-[150px_1fr] gap-4 h-full mt-10">
          {/* Kartu Pemasukan dan Pengeluaran */}
          <div className="bg-white rounded-xl shadow p-4 flex items-center">
            <div className="text-center w-full text-blue-600">
              <h2 className="font-bold text-xl">Pemasukan</h2>
              <p className="text-lg">Rp {incomes.toLocaleString("id-ID")}</p>
              <p className="text-xs text-gray-500">Data pemasukan</p>
            </div>
            <div className="text-center w-full text-red-600">
              <h2 className="font-bold text-xl">Pengeluaran</h2>
              <p className="text-lg">Rp {expenses.toLocaleString("id-ID")}</p>
              <p className="text-xs text-gray-500">Data pengeluaran</p>
            </div>
          </div>

          {/* Kartu Saldo Akhir */}
          <div className="bg-white rounded-xl shadow p-10 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-xl">Saldo Akhir</h2>
              <p className="text-lg">Rp {saldo.toLocaleString("id-ID")}</p>
              <p className="text-xs text-gray-500">Saldo bersih saat ini</p>
            </div>
            <img src="https://images.icon-icons.com/943/PNG/512/shoppaymentorderbuy-04_icon-icons.com_73886.png" alt="wallet" className="w-16 h-16" />
          </div>

          {/* Grafik Bulanan Pemasukan & Pengeluaran */}
          <div className="bg-white rounded-xl shadow p-10 h-[80vh] flex flex-col">
            <h2 className="text-center font-bold text-2xl">Grafik Bulanan</h2>
            <div className="text-center text-blue-700 font-bold mt-2">Pemasukan</div>
            <div className="w-full h-24 rounded">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="pemasukan" stroke="#2684ff" strokeWidth={4} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-red-700 font-bold mt-15">Pengeluaran</div>
            <div className="w-full h-24 rounded">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="pengeluaran" stroke="#ff2d3d" strokeWidth={4} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Pemasukan vs Pengeluaran - YANG SUDAH DIPERBAIKI */}
          <div className="bg-white rounded-xl shadow p-10 flex flex-col items-center justify-center">
            <h2 className="text-center font-bold text-3xl">
              <span className="text-blue-700">Pemasukan</span> vs <span className="text-red-700">Pengeluaran</span>
            </h2>
            {/* Kontainer dengan tinggi eksplisit untuk ResponsiveContainer */}
            <div style={{ width: "100%", height: 250 }}>
              {" "}
              {/* Atur tinggi ini sesuai kebutuhan */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData} // Menggunakan data yang sudah disiapkan
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`Rp ${value.toLocaleString("id-ID")}`, name]} />
                  {/* Anda bisa menambahkan <Legend /> di sini jika ingin keterangan di bawah chart */}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-50 flex flex-col justify-center h-80 bg-gray-50">
        <div className={`flex justify-center p-5 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>
          <div className="flex w-1/2 items-center justify-between">
            <div className="flex flex-col text-3xl font-bold text-red-600 gap-4">
              <span className="flex flex-col">
                SILAKU <span className="text-[9px]">sistem laporan keuangan</span>
              </span>
              <span className="text-black font-normal text-xs">Alamat</span>
              <span className="text-black font-normal text-xs">Nomer HP</span>
              <span className="text-black font-normal text-xs">icon</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Hubungi Kami</span>
              <span className="text-sm text-blue-600">email@example.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
