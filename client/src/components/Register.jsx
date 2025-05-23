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

  const Registrasi = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/registrasi", {
        username,
        email,
        password,
        confPassword,
      });
      navigate("/");
    } catch (err) {
      if (err.response) {
        setMsg(err.response.data.msg);
      }
    }
  };

  return (
      <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-row-reverse text-center items-center justify-around h-[93%] w-[97%]">
          <div
            className="flex items-center justify-center w-screen  h-full rounded-3xl"
            style={{
              backgroundImage: `url('https://media.istockphoto.com/id/2035153356/id/foto/foto-stok-uang-kertas-rupiah.jpg?s=1024x1024&w=is&k=20&c=tDtpDRydAmb81z4e0KTSVgcG3oWNfVTQHUiekQ44_3c=')`,
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
          <div className="w-screen h-full flex flex-col gap-y-5">
            <div className="pt-8 flex flex-col gap-2">
              <header className="text-5xl font-bold">Registrasi</header>
              <p>Selamat datang diwebsite sistem laporan keuangan</p>
              {msg && <p className="text-red-500 text-sm">{msg}</p>}
            </div>
            <form onSubmit={Registrasi} className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 items-center">
                <label className="font-bold pr-70">username :</label>
                <input
                  type="text"
                  className="shadow appearance-none rounded-2xl bg-amber-50 focus:bg-amber-100   py-2 px-4 text-black leading-tight focus:outline-none focus:shadow-outline w-90"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <label className="font-bold pr-77">email :</label>
                <input
                  type="text"
                  className="shadow appearance-none rounded-2xl bg-amber-50 focus:bg-amber-100   py-2 px-4 text-black leading-tight focus:outline-none focus:shadow-outline w-90"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <label className="font-bold pr-70">Password :</label>
                <input
                  type="password"
                  className="shadow appearance-none rounded-2xl bg-amber-50 focus:bg-amber-100 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-37.5 w-90"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="flex font-bold w-90">confirmation Password :</label>
                <input
                  type="password"
                  className="shadow appearance-none rounded-2xl bg-amber-50 focus:bg-amber-100 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-37.5 w-90 mb-5"
                  placeholder="******"
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
              <div className="flex justify-center gap-x-36">
                <div className="">
                  <input type="checkbox" id="remember" className="mr-2 scale-150" />
                  <label htmlFor="remember" className="text-sm">
                    Saya Setuju
                  </label>
                </div>
                <a href="#" className="text-sm underline text-blue-800">
                  Sudah Punya akun?
                </a>
              </div>
                  <button className="w-90 rounded-2xl bg-blue-700 hover:bg-blue-900 cursor-pointer text-white font-bold py-2 px-4" type="submit">
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
