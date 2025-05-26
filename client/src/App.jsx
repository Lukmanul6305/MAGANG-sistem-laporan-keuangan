import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Pemasukan from "./pages/Pemasukan";
import Layout from "./components/Layout"

function App() {
      const [isOpen,setIsOpen] = useState(true)
      const [animate,setAnimate] = useState(false)
  
      const handleToggle = () =>{
          setAnimate(true)
          setIsOpen(!isOpen)
          setTimeout(()=> setAnimate(false),300)
      }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Layout/>
            </>
          }
        />
        <Route
          path="/Pemasukan"
          element={
            <>
              <Navbar
              isOpen={isOpen}
              animate={animate}
              handleToggle={handleToggle}
              />
              <Pemasukan isOpen={isOpen}/>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
