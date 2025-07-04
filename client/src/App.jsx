import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Pemasukan from "./pages/Pemasukan";
import Pengeluaran from "./pages/Pengeluaran";
import DaftarTransaksi from "./pages/DaftarTransaksi";
import Laporan from "./pages/Laporan";
import Profil from "./components/Profil";
import ProfilPage from "./pages/ProfilPages";
import HomePage from "./pages/HomePage";


function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleToggle = () => {
    setAnimate(true);
    setIsOpen(!isOpen);
    setTimeout(() => setAnimate(false), 300);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <Dashboard isOpen={isOpen} userId={userId} />
              <Profil />
            </>
          }
        />
        <Route
          path="/Pemasukan"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <Pemasukan isOpen={isOpen} userId={userId} />
              <Profil />
            </>
          }
        />
        <Route
          path="/Pengeluaran"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <Pengeluaran isOpen={isOpen} userId={userId} />
              <Profil />
            </>
          }
        />
        <Route
          path="/daftarTransaksi"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <DaftarTransaksi isOpen={isOpen} userId={userId} />
              <Profil />
            </>
          }
        />
        <Route
          path="/laporan"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <Laporan isOpen={isOpen} userId={userId}/>
              <Profil />
            </>
          }
        />
        <Route
          path="/profil"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <ProfilPage isOpen={isOpen} userId={userId}/>
            </>
          }
        />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
