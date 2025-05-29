function DashboardAdmin({ isOpen }) {
  const users = [
    { nama: "Lukmanul Hakim", email: "lukman@gmail.com", saldo: 2000000 },
    { nama: "Nabila", email: "nabila@gmail.com", saldo: 3500000 },
    { nama: "Andi", email: "andi@gmail.com", saldo: 1200000 },
  ];

  const rupiah = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(n);

  return (
    <div className={`flex flex-col p-5 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"}`}>
      <div className="flex flex-col p-10 items-start justify-center h-full">
        <h1 className="text-red-700 font-bold text-5xl">Dashboard</h1>
        <p className="text-xs">Admin</p>
      </div>
      <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-indigo-800 text-white">
            <th className="text-left px-6 py-4">Nama</th>
            <th className="text-left px-6 py-4">Email</th>
            <th className="text-left px-6 py-4">Saldo</th>
            <th className="text-left px-6 py-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-6 py-4">{user.nama}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{rupiah(user.saldo)}</td>
              <td className="px-6 py-4">
                <button onClick={() => alert(`Detail ${user.nama}`)} className="bg-indigo-700 hover:bg-indigo-900 text-white px-4 py-2 rounded">
                  Lihat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardAdmin;
