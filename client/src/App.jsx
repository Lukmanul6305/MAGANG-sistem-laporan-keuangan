import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Pemasukan from "./pages/Pemasukan";
import Layout from "./components/Layout";
import Pengeluaran from "./pages/Pengeluaran";
import DaftarTransaksi from "./pages/DaftarTransaksi";
import Laporan from "./pages/Laporan";
import Profil from "./components/Profil";
import ProfilPage from "./pages/ProfilPages";

import NavbarAdmin from './components/NavbarAdmin'
import DashboardAdmin from './pages/admin/DashboardAdmin'

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [animate, setAnimate] = useState(false);

  const handleToggle = () => {
    setAnimate(true);
    setIsOpen(!isOpen);
    setTimeout(() => setAnimate(false), 300);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Admin" element={
          <>
            <NavbarAdmin
            isOpen={isOpen}
            animate={animate}
            handleToggle={handleToggle}
            />
            <DashboardAdmin isOpen={isOpen}/>
          </>
        } />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <Dashboard isOpen={isOpen} />
              <Profil />
            </>
          }
        />
        <Route
          path="/Pemasukan"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <Pemasukan isOpen={isOpen} />
              <Profil />
            </>
          }
        />
        <Route
          path="/Pengeluaran"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <Pengeluaran isOpen={isOpen} />
              <Profil />
            </>
          }
        />
        <Route
          path="/daftarTransaksi"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <DaftarTransaksi isOpen={isOpen} />
              <Profil />
            </>
          }
        />
        <Route
          path="/laporan"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <Laporan isOpen={isOpen} />
              <Profil/>
            </>
          }
        />
        <Route
          path="/profil"
          element={
            <>
              <Navbar isOpen={isOpen} animate={animate} handleToggle={handleToggle} />
              <ProfilPage isOpen={isOpen} />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
