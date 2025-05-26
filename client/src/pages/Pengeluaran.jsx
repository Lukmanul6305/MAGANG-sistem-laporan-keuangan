const Pengeluaran = ({ isOpen }) => {
  return (
    <div className={`flex flex-col p-5 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"} max-w-full  `}>
      <header className="flex w-full h-20 justify-between">
        <div className="flex flex-col justify-end">
          <h1 className="text-red-700 font-bold text-4xl">Buat Pengeluaran</h1>
          <p className="text-xs">Buat laporan mudah cepat dan aman</p>
        </div>
      </header>
        <h1 className="font-bold text-2xl flex w-full h-15 justify-center items-center">
            Pengeluaran Laporan Keuangan
        </h1>
        <form className="flex flex-col gap-1">
            <div className="flex flex-col">
                <label className="p-1 text-lg">Tanggal :</label>
                <input type="date" className="border rounded-2xl p-2 text-xs text-gray-500 border-black" />
            </div>
            <div className="flex flex-col">
                <label className="p-1 text-lg">Jenis Transaksi :</label>
                <input type="text"   className="border rounded-2xl p-2 text-xs text-gray-500 border-black" />
            </div>
            <div className="flex flex-col">
                <label className="p-1 text-lg">Nominal (Rp):</label>
                <input type="number" placeholder="masukan Nominal" className=" border rounded-2xl p-2 text-xs text-gray-500 border-black" />
            </div>
            <div className="flex flex-col">
                <label className="p-1 text-lg">Kategori</label>
                <input type="text" placeholder="-" className="border rounded-2xl p-2 text-xs text-gray-500 border-black" />
            </div>
            <div className="flex flex-col">
                <label className="p-1 text-lg">Metode Pembayaran</label>
                <input type="text" placeholder="-" className="border rounded-2xl p-2 text-xs text-gray-500 border-black" />
            </div>
            <div className="w-full flex justify-end items-end h-20">
                <button className="bg-blue-600 p-2 w-30 rounded-2xl text-white font-bold cursor-pointer">Buat</button>
            </div>
        </form>
    </div>
  );
};

export default Pengeluaran;
