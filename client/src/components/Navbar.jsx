import { useState } from "react";

const Navbar = () => {
  let name = "Lukmanul Hakim"
  const [activeButton, setActiveButton] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "buat", label: "Buat laporan", icon: "✏️" },
    { id: "transaksi", label: "Daftar Transaksi", icon: "📋" },
    { id: "keuangan", label: "Laporan Keuangan", icon: "📈" },
  ];
  return (
    <nav className="h-screen w-100 bg-blue-700 w-80 rounded-r-[20px] flex flex-col items-center">
      <header className="flex justify-center items-center text-red-700 font-bold text-7xl w-full h-30">
          SILAKU
        </header>
        <img src="https://images.icon-icons.com/2859/PNG/512/avatar_face_man_boy_profile_smiley_happy_people_icon_181659.png" className="bg-red-500 w-36 rounded-full border-white border" alt="profil" />
        <h1 className="p-7 font-bold text-3xl text-white">{name}</h1>
      <div className="flex flex-col gap-3">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveButton(item.id)}
          className={`font-bold flex text-2xl items-center w-70 h-15 p-2 rounded text-white cursor-pointer transition-colors duration-200
            ${activeButton === item.id ? "bg-blue-800" : "bg-blue-500"}
          `}
        >
          <span className="w-10 p-1">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
      {/* <div className="flex flex-col items-center">
        <header className="flex justify-center items-center text-red-700 font-bold text-7xl w-full h-30">
          SILAKU
        </header>
        <img src="https://images.icon-icons.com/2859/PNG/512/avatar_face_man_boy_profile_smiley_happy_people_icon_181659.png" className="bg-red-500 w-36 rounded-full border-white border" alt="profil" />
        <h1 className="p-7 font-bold text-3xl text-white">{name}</h1>
        <div className="flex flex-col gap-3"> 
          <button className="bg-blue-500 font-bold flex text-2xl items-center w-70 h-15 p-2 rounded text-white cursor-pointer">
            <img src="https://images.icon-icons.com/4147/PNG/512/dashboard_analytics_dashboard_performance_data_visualization_icon_261170.png" className="w-10 p-1" alt="logo" /> Dashboard
          </button>
          <button className=" bg-blue-500 font-bold flex text-2xl items-center w-70 h-15 p-2 rounded text-white cursor-pointer">
            <img src="https://images.icon-icons.com/1759/PNG/512/4124803-compose-edit-pencil-write-us-writing_113896.png" className="w-10 p-1" alt="logo" /> Buat laporan
          </button>
          <button className=" bg-blue-500 font-bold flex text-2xl items-center w-70 h-15 p-2 rounded text-white cursor-pointer">
            <img src="https://images.icon-icons.com/1893/PNG/512/clipboard_120835.png" className="w-10 p-1" alt="logo" /> Daftar Transaksi
          </button>
          <button className=" bg-blue-500 font-bold flex text-2xl items-center w-70 h-15 p-2 rounded text-white cursor-pointer">
            <img src="https://images.icon-icons.com/1759/PNG/512/4124799-finance-report-graph-analysis-graph-report-sale-report-stock-report_113890.png" className="w-10 p-1" alt="logo" /> Laporan keuangan
          </button>
        </div>
      </div> */}
      <footer className="text-white text-center text-sm pb-4 mt-auto">
        &copy; 2025 Lukmanul
      </footer>
    </nav>
































    // <nav className="bg-white shadow-md">
    //   <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    //     {/* Logo / Home */}
    //     <Link to="/" className="text-xl font-bold text-gray-800">
    //       Home
    //     </Link>

    //     {/* Logout */}
    //     <button
    //       onClick={() => {
    //         // logika logout di sini
    //         console.log("Logged out");
    //       }}
    //       className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
    //     >
    //       Logout
    //     </button>
    //   </div>
    // </nav>
  );
};

export default Navbar;
