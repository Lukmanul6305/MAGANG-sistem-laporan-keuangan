import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        withCredentials: true,
      });
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setName(decoded.name);
      console.log(decoded);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col w-full p-5">
      <header className="flex w-full h-50 justify-between mb-20">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-red-700 font-bold text-5xl">Dashboard</h1>
          <p className="text-xs" >ini tanggal</p>
        </div>
          <button onClick={(e)=> alert("kepencet")} className="h-10"><img src="https://images.icon-icons.com/2468/PNG/512/user_kids_avatar_user_profile_icon_149314.png" className="w-10" alt="" /></button>
      </header>
      <div className="grid grid-cols-2 grid-rows-[150px_1fr] gap-4 h-full gap-2">
        <div className="bg-white rounded-xl shadow p-4 flex  items-center">
          <div className="text-center w-full">
            <h2 className="font-bold text-xl">Pemasukan</h2>
            <p className="text-lg">$ 4.000.000</p>
            <p className="text-xs text-gray-500">(Empat Puluh Juta Rupiah)</p>
          </div>
          <div className="text-center w-full">
            <h2 className="font-bold text-xl">Pengeluaran</h2>
            <p className="text-lg">$ 2.000.000</p>
            <p className="text-xs text-gray-500">(Dua Puluh Juta Rupiah)</p>
          </div>
      </div>
        
        <div className="bg-white rounded-xl shadow p-10 flex justify-between items-center">
    <div>
      <h2 className="font-bold text-xl">Saldo Akhir</h2>
      <p className="text-lg">$ 2.000.000</p>
      <p className="text-xs text-gray-500">(Dua Puluh Juta Rupiah)</p>
    </div>
    <img src="https://images.icon-icons.com/943/PNG/512/shoppaymentorderbuy-04_icon-icons.com_73886.png" alt="wallet" className="w-16 h-16" />
  </div>


    <div className=" bg-white rounded-xl shadow p-10">
    <h2 className="text-center font-bold text-lg">Grafik Bulanan</h2>
    <div className="text-center text-blue-700 font-bold">Pemasukan</div>
    <div className="w-full h-24 bg-blue-500 my-1 rounded" />
    <div className="text-center text-red-700 font-bold">Pengeluaran</div>
    <div className="w-full h-24 bg-red-500 mt-1 rounded" />
  </div>
  <div className="bg-white rounded-xl shadow p-10">
    <h2 className="text-center font-bold text-lg">
      <span className="text-blue-700">Pemasukan</span> vs <span className="text-red-700">Pengeluaran</span>
    </h2>
    <div className="w-full flex justify-center mt-4">
      <div className="w-40 h-40 rounded-full overflow-hidden flex">
        <div className="w-1/2 h-full bg-blue-600" />
        <div className="w-1/2 h-full bg-red-600" />
      </div>
    </div>
  </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
