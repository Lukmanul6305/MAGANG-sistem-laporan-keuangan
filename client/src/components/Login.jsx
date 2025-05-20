import React from "react";

const Login = () => {
  return (
    <div>
      <div className="colomns">
        <div className="colomn">
          <form className="box">
            <div>
              <section className="bg-gray-100 w-full min-h-screen">
                <div className="flex items-center justify-center h-full">
                  <div className="w-full max-w-md px-4">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email or Username</label>
                        <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Email or Username" />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="******" />
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

export default Login;
