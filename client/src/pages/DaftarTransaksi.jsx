const daftarTransaksi = ({ isOpen }) => {
    const data = [
    { tanggal: "2025-05-05", jenis: "Produk A", kategori: 150, nominal: "Rp 50.000",metode: "cash",keterangan:"misal gaji",aksi : ["✏️","|","🗑️"] },
    { tanggal: "2025-05-05", jenis: "Produk B", kategori: 80, nominal: "Rp 75.000",metode: "cash",keterangan:"misal gaji",aksi : ["✏️","|","🗑️"] },
    { tanggal: "2025-05-05", jenis: "Produk C", kategori: 200, nominal: "Rp 30.000",metode: "cash",keterangan:"misal gaji",aksi : ["✏️","|","🗑️"] },
    { tanggal: "2025-05-05", jenis: "Produk D", kategori: 45, nominal: "Rp 120.000",metode: "cash",keterangan:"misal gaji",aksi : ["✏️","|","🗑️"] },
  ];
  return (
    <div className={`flex flex-col p-5 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"} max-w-full `}>
      <header className="flex w-full h-40 items-center justify-between mb-20">
        <div className="flex flex-col justify-end">
          <h1 className="text-red-700 font-bold text-4xl">Daftar Transaksi</h1>
          <p className="text-xs">Lihat daftar transaksi anda disini</p>
        </div>
      </header>
        <form className="flex flex-col">
            <div className="flex justify-between mb-5">
                <div>
                <input type="search" placeholder="Search" className="text-1xl text-gray-500 border-black border-b-1 mr-3" />
                <button className="border p-1 w-20 rounded-sm cursor-pointer">Cari</button>
                </div>
                <button className="border p-1 w-20 rounded-sm cursor-pointer">Filter</button>
            </div>
            <div className="overflow-x-auto rounded-2xl 2xl:h-120 bg-gray-100"> {/* Untuk responsivitas horizontal */}
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                            <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Jenis</th>
                            <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Kategori</th>
                            <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Nominal</th>
                            <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">Metode</th>
                            <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700">keterangan</th>
                            <th className="py-2 px-4 border-b border-r border-gray-300 bg-blue-400 text-left text-sm font-semibold text-gray-700 w-20">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id} className="bg-white hover:bg-gray-50">
                            <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.tanggal}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.jenis}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.kategori}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.nominal}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.metode}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.keterangan}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-300 text-sm text-gray-800">{item.aksi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-5">
            <button className="w-full flex justify-end" >1 2 3 4 5 6 ...</button>
            <div className="w-full flex justify-end gap-5">
                <button>Prev</button>
                <button>Next</button>
            </div>
            </div>
        </form>
    </div>
  );
};

export default daftarTransaksi;
