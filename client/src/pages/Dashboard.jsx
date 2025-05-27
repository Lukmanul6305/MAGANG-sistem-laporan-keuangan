import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"

const Dashboard = ({isOpen}) => {
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
    <div>

    <div className={`flex flex-col p-5 transition-all duration-300 ease-in-out ${
        isOpen ? "lg:ml-70" : "lg:ml-20"
      }`}>
      <header className="flex flex-col w-full h-50 justify-between">
        <div className="flex flex-col items-start justify-center h-full">
          <h1 className="text-red-700 font-bold text-5xl">Dashboard</h1>
          <p className="text-xs" >ini tanggal</p>
        </div>
        <div>
          <h1 className="flex flex-col font-bold text-3xl text-blue-600">Hallo <span className="text-2xl">Lukmanul hakim</span></h1>
        </div>
      </header>
      <div className="grid grid-cols-2 grid-rows-[150px_1fr] gap-4 h-full mt-10">
        <div className="bg-white rounded-xl shadow p-4 flex  items-center">
          <div className="text-center w-full text-blue-600">
            <h2 className="font-bold text-xl">Pemasukan</h2>
            <p className="text-lg">$ 4.000.000</p>
            <p className="text-xs text-gray-500">(Empat Puluh Juta Rupiah)</p>
          </div>
          <div className="text-center w-full text-red-600">
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
      <footer className="mt-50 flex flex-col justify-center  h-80 bg-gray-50">
        <div className={`flex justify-center p-5 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>
          <div className="flex w-1/2 items-center justify-between">
          <div className="flex flex-col text-3xl font-bold text-red-600 gap-4">
            <span className="flex flex-col"> SILAKU <span className="text-[9px]">sistem laporan keuangan</span> </span> <span className="text-black font-normal text-xs">Alamat</span> <span className="text-black font-normal text-xs">Nomer HP</span> <span className="text-black font-normal text-xs">icon</span>
          </div>
          <div className="flex flex-col">
            hubungi kami <span>gmail</span>
          </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
