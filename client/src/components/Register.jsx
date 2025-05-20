import { useState } from "react";
import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, useMsg] = useState("");

  const history = useHistory();

  const Registrasi = async (e) => {
    try {
      await axios.post("https://localhost:5000/users", {
        username: name,
        email: email,
        password: password,
        confPassword: confPassword,
      });
      history.post("/");
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
      }
    }
  };

  return (
    <div>
      <div className="colomns">
        <div className="colomn">
          <form className="box" onSubmit={Register}>
            <div>
              <section className="bg-gray-100 w-full min-h-screen">
                <div className="flex items-center justify-center h-full">
                  <div className="w-full max-w-md px-4">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                          type="text"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Username"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                          type="email"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                          type="password"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="******"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">ConfPassword</label>
                        <input
                          type="password"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="******"
                          value={confPassword}
                          onChange={(e) => {
                            e.target.value;
                          }}
                        />
                      </div>
                      <div className="mb-4">
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Login</button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
