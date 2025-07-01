import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  function handleClick(e) {
    e.preventDefault();
    navigate("/login");
  }
  const Registrasi = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/registrasi", {
        username: username,
        email: email,
        password: password,
        confPassword: confPassword,
      });
      alert("membuat user Berhasil");
      navigate("/");
    } catch (err) {
      if (err.response) {
        setMsg(err.response.data.msg);
        setMsg("Terjadi kesalahan saat registrasi.");
      }
    }
  };

return (
  <>
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col lg:flex-row-reverse text-center items-center justify-center w-full max-w-7xl h-auto lg:h-[90vh] lg:items-stretch lg:gap-8">

        {/* Right Section (Image and Title - now on the right in desktop due to flex-row-reverse) */}
        <div
          className="flex items-center justify-center w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-full rounded-3xl mb-8 lg:mb-0"
          style={{
            backgroundImage: `url('https://media.istockphoto.com/id/2035153356/id/foto/foto-stok-uang-kertas-rupiah.jpg?s=1024x1024&w=is&k=20&c=tDtpDRydAmb81z4e0KTSVgcG3oWNfVTQHUiekQ44_3c=')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <p className="flex flex-col font-bold text-4xl sm:text-5xl lg:text-5xl gap-2 text-shadow-md p-4">
            <span>
              <span className="text-red-700 text-shadow-md">$</span>
              <span className="text-blue-700 text-shadow-md">LAKU</span>
            </span>
            SISTEM LAPORAN <br /> KEUANGAN
          </p>
        </div>

        <div
          className="w-full lg:w-1/2 h-full flex flex-col gap-y-6 md:gap-y-8 lg:gap-y-10 items-center justify-center"
        >
          <div className="pt-4 md:pt-6 lg:pt-0 flex flex-col gap-2 w-full max-w-sm">
            <header className="text-4xl sm:text-5xl lg:text-5xl font-bold">Registrasi</header> {/* Changed to Registrasi */}
            <p>Selamat datang diwebsite sistem laporan keuangan</p>
            {msg && <p className="text-red-500 text-sm">{msg}</p>}
          </div>

          <form onSubmit={Registrasi} className="flex flex-col gap-4 md:gap-6 w-full max-w-sm">
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold self-start">username :</label> {/* Adjusted label alignment */}
              <input
                type="text"
                className="shadow appearance-none rounded-2xl bg-amber-50 focus:bg-amber-100 py-2 px-4 text-black leading-tight focus:outline-none focus:shadow-outline w-full"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold self-start">email :</label> {/* Adjusted label alignment */}
              <input
                type="text"
                className="shadow appearance-none rounded-2xl bg-amber-50 focus:bg-amber-100 py-2 px-4 text-black leading-tight focus:outline-none focus:shadow-outline w-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 w-full"> {/* Changed to w-full */}
              <label className="font-bold self-start">Password :</label> {/* Adjusted label alignment */}
              <input
                type="password"
                className="shadow appearance-none rounded-2xl bg-amber-50 focus:bg-amber-100 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full" // Changed w-90 to w-full, removed mx-37.5
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="font-bold self-start">confirmation Password :</label> {/* Adjusted label alignment */}
              <input
                type="password"
                className="shadow appearance-none rounded-2xl bg-amber-50 focus:bg-amber-100 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full mb-5" // Changed w-90 to w-full, removed mx-37.5
                placeholder="******"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center w-full gap-4"> {/* Adjusted gap */}
              <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2"> {/* Responsive for checkbox and link */}
                <div className="flex items-center">
                  <input type="checkbox" id="agree" className="mr-2 scale-125" /> {/* Changed id to 'agree' */}
                  <label htmlFor="agree" className="text-sm">
                    Saya Setuju
                  </label>
                </div>
                <button onClick={(e) => handleClick(e)} className="text-sm underline text-blue-800 cursor-pointer mt-2 sm:mt-0"> {/* Added margin-top for mobile */}
                  Sudah Punya akun?
                </button>
              </div>
              <button className="w-full rounded-2xl bg-blue-700 hover:bg-blue-900 cursor-pointer text-white font-bold py-2 px-4" type="submit">
                Registrasi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
);
};

export default Register;
