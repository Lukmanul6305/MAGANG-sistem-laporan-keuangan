import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = ({ isOpen }) => {
  const [name, setName] = useState("Pengguna");
  const [saldo, setSaldo] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [incomes, setIncomes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bulanan, setBulanan] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());

  const [userId, setUserId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("loggedInUsername");

    if (storedUserId) {
      setUserId(storedUserId);
      if (storedUsername) {
        setName(storedUsername);
      }
    } else {
      console.warn("User ID tidak ditemukan di localStorage. Mengarahkan ke halaman login.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!userId) {
      return; 
    }

    const fetchData = async () => {
      setLoading(true); 
      try {
        const [saldoRes, incomeRes, expenseRes, bulananRes] = await Promise.all([
          fetch(`http://localhost:5000/api/transaksi/saldo?user_id=${userId}`).then((res) => res.json()),
          fetch(`http://localhost:5000/api/transaksi/incomes?user_id=${userId}`).then((res) => res.json()),
          fetch(`http://localhost:5000/api/transaksi/expens?user_id=${userId}`).then((res) => res.json()),
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

    fetchData();
  }, [userId]); 
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const data = bulanan.map((item) => {
    const bulanFormat = new Date(item.bulan + "-01").toLocaleString("id-ID", { month: "short" });
    return {
      bulan: bulanFormat,
      pemasukan: item.total_pemasukan,
      pengeluaran: item.total_pengeluaran,
    };
  });

  const pieChartData = [
    { name: "Pemasukan", value: incomes },
    { name: "Pengeluaran", value: expenses },
  ];

  const PIE_COLORS = ["#2563EB", "#DC2626"];

  if (loading) {
    return <p className="p-10 text-center">Memuat data dashboard...</p>;
  }

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

                <div className="bg-white rounded-xl shadow p-10 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-xl">Saldo Akhir</h2>
                        <p className="text-lg">Rp {saldo.toLocaleString("id-ID")}</p>
                        <p className="text-xs text-gray-500">Saldo bersih saat ini</p>
                    </div>
                    <img src="https://images.icon-icons.com/943/PNG/512/shoppaymentorderbuy-04_icon-icons.com_73886.png" alt="wallet" className="w-16 h-16" />
                </div>

                <div className="bg-white rounded-xl shadow p-10 h-[80vh] flex flex-col">
                    <h2 className="text-center font-bold text-2xl">Grafik Bulanan</h2>
                    <div className="text-center text-blue-700 font-bold mt-2">Pemasukan</div>
                    <div className="w-full h-24 rounded">
                        <ResponsiveContainer width="100%" height={150}>
                            <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="bulan" />
                            <YAxis />
                            <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
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
                            <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
                            <Line type="monotone" dataKey="pengeluaran" stroke="#ff2d3d" strokeWidth={4} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-10 flex flex-col items-center justify-center">
                    <h2 className="text-center font-bold text-3xl">
                    <span className="text-blue-700">Pemasukan</span> vs <span className="text-red-700">Pengeluaran</span>
                    </h2>
                    <div style={{ width: "100%", height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie
                                data={pieChartData}
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
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;