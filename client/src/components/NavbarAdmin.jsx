// function SidebarAdmin() {
//   return (
//     <aside className="w-64 fixed h-full bg-indigo-800 text-white p-5">
//       <h2 className="text-center text-xl font-semibold mb-8">Admin Panel</h2>
//       <ul className="space-y-2">
//         <li className="hover:bg-indigo-900 p-3 rounded cursor-pointer">Dashboard</li>
//         <li className="bg-indigo-900 p-3 rounded font-bold">Data User</li>
//         <li className="hover:bg-indigo-900 p-3 rounded cursor-pointer">Daftar Laporan</li>
//         <li className="hover:bg-indigo-900 p-3 rounded cursor-pointer">Statistik Keuangan</li>
//         <li className="hover:bg-indigo-900 p-3 rounded cursor-pointer">Kelola Akses / Hak Akses</li>
//         <li className="hover:bg-indigo-900 p-3 rounded cursor-pointer">Log Aktivitas</li>
//         <li className="hover:bg-indigo-900 p-3 rounded cursor-pointer">Logout</li>
//       </ul>
//     </aside>
//   );
// }

// export default SidebarAdmin;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SidebarAdmin = ({ isOpen, handleToggle, animate }) => {
  let name = "Admin";
  const [activeButton, setActiveButton] = useState("");
  const navigate = useNavigate();

  const handleClickPemasukan = (e) => {
    e.preventDefault();
    navigate("/Pemasukan");
  };
  const handleClickPengeluaran = (e) => {
    e.preventDefault();
    navigate("/Pengeluaran");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/dashboard" },
    { id: "Data", label: "Data User", icon: "✏️" },
    { id: "laporan", label: "Daftar Laporan", icon: "📋", path: "" },
    { id: "statistik", label: "Kelola Akses", icon: "📈", path: "" },
    { id: "aktivitas", label: "Log Aktivitas", icon: "📈", path: "" },
  ];

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
        src="https://images.icon-icons.com/1993/PNG/512/account_avatar_face_man_people_profile_user_icon_123197.png"
        className={`rounded-full transition-all duration-300 ease-in-out
          ${isOpen ? "w-30" : "w-15"}`}
        alt="profil"
      />

      <h1 className="p-7 font-bold md:text-1xl lg:text-2xl text-white transition-all duration-300 ease-in-out">{isOpen ? name : ""}</h1>

      <div className="flex flex-col gap-3 items-center w-full">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                setActiveButton(activeButton === "buat" ? null : item.id);
                navigate(item.path);
              }}
              className={`font-bold flex items-center p-2 rounded text-white cursor-pointer transition-all duration-200 hover:bg-blue-600
              ${activeButton === item.id ? "bg-blue-800" : "bg-blue-500"}
              ${isOpen ? "sm:w-70 sm:h-10 lg:w-50" : "w-fit h-fit justify-center"}
              `}
            >
              <span className="w-10 p-1">{item.icon}</span>
              {isOpen && item.label}
            </button>
            {item.id === "buat" && activeButton === "buat" && isOpen && (
              <div className="flex flex-col justify-between absolute lg:w-50 gap-3 p-3 bg-blue-400">
                <button className="flex items-center bg-blue-700 font-bold text-white lg:p-3 rounded cursor-pointer" onClick={handleClickPemasukan}>
                  <img src="https://images.icon-icons.com/2313/PNG/512/wallet_payment_purchase_coin_cash_money_icon_141978.png" className="w-10 p-2" />
                  Pemasukan
                </button>
                <button className="flex items-center bg-blue-700 font-bold text-white lg:p-3 rounded cursor-pointer" onClick={handleClickPengeluaran}>
                  <img src="https://images.icon-icons.com/550/PNG/512/business-color_money-coins_icon-icons.com_53446.png" className="w-10 p-2" />
                  Pengeluaran
                </button>
              </div>
            )}
            {item.id === "buat" && activeButton === "buat" && !isOpen && (
              <div className="flex flex-col fixed lg:left-20 lg:top-60 bg-blue-500 rounded-r-lg">
                <button onClick={handleClickPemasukan} className=" lg:p-3 hover:bg-blue-700 rounded-tr-lg">
                  <img src="https://images.icon-icons.com/2313/PNG/512/wallet_payment_purchase_coin_cash_money_icon_141978.png" className="w-10 " />
                </button>
                <button onClick={handleClickPengeluaran} className=" lg:p-3 hover:bg-blue-700 rounded-br-lg">
                  <img src="https://images.icon-icons.com/550/PNG/512/business-color_money-coins_icon-icons.com_53446.png" className="w-10" />
                </button>
              </div>
            )}
          </div>
        ))}
        
      </div>

      <footer className="text-white text-center text-sm pb-4 mt-auto">&copy; 2025 Lukmanul</footer>
      <div className="fixed">
          <button className="h-10 fixed right-5 top-5 text-blue-700">Logout</button>
        </div>
    </nav>
  );
};

export default SidebarAdmin;
