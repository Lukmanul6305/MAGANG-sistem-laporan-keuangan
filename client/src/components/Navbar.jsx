import React, { useState, useEffect } from "react";
// FIXED: Removed useLocation to prevent crash in preview environments.
// Link is still needed for navigation.
import { Link } from "react-router-dom";

// Terima 'name' sebagai prop dari App.jsx
const Navbar = ({ isOpen, handleToggle, animate }) => {
  const [isBuatOpen, setIsBuatOpen] = useState(false);
  // ADDED: State to hold the username
  const [name, setName] = useState("Pengguna");

  // ADDED: useEffect to get username from localStorage when the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUsername");
    if (storedUsername) {
      setName(storedUsername);
    }
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/dashboard" },
    { id: "buat", label: "Buat laporan", icon: "✏️" },
    { id: "transaksi", label: "Daftar Transaksi", icon: "📋", path: "/daftarTransaksi" },
    { id: "keuangan", label: "Laporan Keuangan", icon: "📈", path: "/laporan" },
  ];

  // Fungsi untuk menutup dropdown "Buat Laporan" jika area lain diklik
  const handleMenuClick = (item) => {
    if (item.id !== "buat") {
      setIsBuatOpen(false);
    }
  };

  return (
    <nav
      className={`h-screen bg-blue-700 rounded-r-[20px] flex flex-col items-center fixed transition-all duration-300 ease-in-out
        ${isOpen ? "lg:w-70" : "lg:w-20"}`}
    >
      <button
        onClick={handleToggle}
        className={`flex justify-center items-center text-red-700 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl w-full h-24 
          transition-transform duration-300 ease-in-out ${animate ? "scale-110" : "scale-100"}`}
      >
        {isOpen ? "SILAKU" : "$"}
      </button>

      <img
        src="https://images.icon-icons.com/2859/PNG/512/avatar_face_man_boy_profile_smiley_happy_people_icon_181659.png"
        className={`bg-red-500 rounded-full border-white border transition-all duration-300 ease-in-out
          ${isOpen ? "w-30" : "w-15"}`}
        alt="profil"
      />

      <h1 className="p-7 font-bold md:text-1xl lg:text-2xl text-white transition-all duration-300 ease-in-out">{isOpen ? name : ""}</h1>

      <div className="flex flex-col gap-3 items-center w-full">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.path ? (
              <Link
                to={item.path}
                onClick={() => handleMenuClick(item)}
                className={`font-bold flex items-center p-2 rounded text-white cursor-pointer transition-all duration-200 bg-blue-500 hover:bg-blue-600
                  ${isOpen ? "sm:w-50 sm:h-15 lg:w-50" : "w-fit h-fit justify-center"}
                `}
              >
                <span className="w-10 p-1">{item.icon}</span>
                {isOpen && item.label}
              </Link>
            ) : (
              // "Buat Laporan" tetap menggunakan <button> karena fungsinya beda
              <button
                onClick={() => setIsBuatOpen(!isBuatOpen)}
                className={`font-bold flex items-center p-2 rounded text-white cursor-pointer transition-all duration-200 hover:bg-blue-600
                  ${isBuatOpen ? "bg-blue-800" : "bg-blue-500"}
                  ${isOpen ? "sm:w-50 sm:ml-10 sm:mr-10 sm:h-15 lg:w-50" : "w-fit h-fit justify-center"}
                `}
              >
                <span className="w-10 p-1">{item.icon}</span>
                {isOpen && item.label}
              </button>
            )}

            {/* Logika dropdown "Buat Laporan" */}
            {item.id === "buat" && isBuatOpen && (
              <div
                className={`flex flex-col gap-3 p-3 bg-blue-400
                  ${isOpen ? "absolute sm:left-10 sm:right-10 lg:w-50" : "fixed lg:left-20 top-auto bg-blue-500 rounded-r-lg p-0"}`}
              >
                <Link to="/Pemasukan" onClick={() => setIsBuatOpen(false)} className={`flex items-center bg-blue-700 font-bold text-white rounded cursor-pointer hover:bg-blue-800 ${isOpen ? "lg:p-3" : "p-3 rounded-tr-lg rounded-br-none"}`}>
                  <img src="https://images.icon-icons.com/2313/PNG/512/wallet_payment_purchase_coin_cash_money_icon_141978.png" className="w-10 p-2" alt="Pemasukan" />
                  {isOpen && "Pemasukan"}
                </Link>
                <Link
                  to="/Pengeluaran"
                  onClick={() => setIsBuatOpen(false)}
                  className={`flex items-center bg-blue-700 font-bold text-white rounded cursor-pointer hover:bg-blue-800 ${isOpen ? "lg:p-3" : "p-3 rounded-br-lg rounded-tr-none"}`}
                >
                  <img src="https://images.icon-icons.com/550/PNG/512/business-color_money-coins_icon-icons.com_53446.png" className="w-10 p-2" alt="Pengeluaran" />
                  {isOpen && "Pengeluaran"}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="text-white text-center text-sm pb-4 mt-auto">&copy; 2025 {name}</footer>
    </nav>
  );
};

export default Navbar;
