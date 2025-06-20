import React, { useState, useEffect } from "react"; // Tambahkan useEffect
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  
  // --- LANGKAH 1: Tambah State untuk Checkbox ---
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  // --- LANGKAH 4: Isi Email Saat Halaman Dimuat ---
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []); // Array kosong memastikan ini hanya berjalan sekali saat komponen dimuat

  function handleClick(e){
    e.preventDefault()
    navigate('/register')
  }

  const Auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      
      if (response.data.user) {
        localStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
        localStorage.setItem('loggedInUsername', response.data.user.username);
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('email', response.data.user.email);

        // --- LANGKAH 3: Simpan atau Hapus Email Berdasarkan Checkbox ---
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
      }
      
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        setMsg(err.response.data.msg);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex text-center items-center justify-around h-[93%] w-[97%]">
          <div
            className="flex items-center justify-center w-screen h-full rounded-3xl"
            style={{
              backgroundImage: `url('https://media.istockphoto.com/id/1449968797/id/foto/seri-uang-rupiah-indonesia-dengan-nilai-seratus-ribu-rupiah-rp-100000-edisi-2016.jpg?s=1024x1024&w=is&k=20&c=5c4HWeEk6umZCpvnH81NTMdbAQ8VAqlFq1TrD1kVKiU=')`,
            }}
          >
            <p className="flex flex-col font-bold text-5xl gap-2 text-shadow-md">
              <span>
                <span className="text-blue-700 text-shadow-md">$</span>
                <span className="text-red-700 text-shadow-md">LAKU</span>
              </span>
              SISTEM LAPORAN <br /> KEUANGAN
            </p>
          </div>
          <div className="w-screen h-full flex flex-col gap-y-10">
            <div className="pt-8 flex flex-col gap-2">
              <header className="text-5xl font-bold">Login</header>
              <p>Selamat datang diwebsite sistem laporan keuangan</p>
              {msg && <p className="text-red-500 text-sm">{msg}</p>}
            </div>
            <form onSubmit={Auth} className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 items-center">
                <label className="font-bold pr-50">Email atau Username :</label>
                <input
                  type="text"
                  className="shadow appearance-none rounded-2xl bg-amber-50 focus:bg-amber-100 py-2 px-4 text-black leading-tight focus:outline-none focus:shadow-outline w-90"
                  placeholder="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <label className="font-bold pr-70">Password :</label>
                <input
                  type="password"
                  className="shadow appearance-none rounded-2xl bg-amber-50 focus:bg-amber-100 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-90"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div className="flex justify-center gap-x-40">
                <div className="">
                  {/* --- LANGKAH 2: Hubungkan Checkbox dengan State --- */}
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="mr-2 scale-150"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="text-sm">
                    Ingatkan saya
                  </label>
                </div>
                <a href="#" className="text-sm underline text-blue-800">
                  Lupa password
                </a>
              </div>
              <div>
                <div className="mb-4">
                  <button className="w-90 rounded-2xl bg-blue-700 hover:bg-blue-900 cursor-pointer text-white font-bold py-2 px-4" type="submit">
                    Login
                  </button>
                </div>
                <div className="w-full flex justify-center gap-4 text-gray-300 items-center">
                  <hr className="border-t-2 border-gray-300 my-4 w-37" />
                  atau
                  <hr className="border-t-2 border-gray-300 my-4 w-37" />
                </div>
                <div className="mb-4" onClick={(e)=>handleClick(e)}>
                  <button className="w-90 rounded-2xl bg-blue-700 hover:bg-blue-900 cursor-pointer text-white font-bold py-2 px-4">Registrasi</button>
                </div>
                <div className="flex justify-center">
                  <button className="flex justify-center w-90 rounded-2xl bg-white border hover:bg-amber-100 cursor-pointer text-black py-2 px-4 text-xs align-center ">
                    <img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="logo google" className="w-5" /> sign in up with google
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;