import iconProfil from "../assets/user.png"
import iconKeluar from "../assets/shutdown.png"

const ProfilPage = ({isOpen})=>{
    return(
        <div className={`flex flex-col p-10 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"} max-w-full`}>
            <div className="flex justify-between">
            <div className="flex">
                <img src="https://images.icon-icons.com/2859/PNG/512/avatar_face_man_boy_profile_smiley_happy_people_icon_181659.png" className="w-50 bg-blue-200 rounded-full" alt="" />
                <div className="ml-5">
                    <h1 className="text-4xl font-bold">Lukmanul Hakim</h1>
                    <h6>Email : lukmanulhakim6305@gmail.com</h6>
                    <h6>Nomer Telepon : 086666666</h6>
                    <button className="p-2 bg-blue-600 rounded-2xl text-xs font-bold text-white mt-1">Edit Profil</button>
                </div>
            </div>
            <div className="flex flex-col gap-5 justify-center">
                <div className="flex flex-col items-center p-5 shadow-sm rounded-lg text-xs text-blue-600 font-bold">
                    Total input Pemasukan<span>angka</span>
                </div>
                <div className="flex flex-col items-center p-5 shadow-sm rounded-lg text-xs text-blue-600 font-bold">
                    Total input Pengeluaran <span>angka</span>
                </div>
            </div>
            </div>
            <div className="mt-5 bg-gray-100 rounded p-2">
                <div className="flex items-center justify-center gap-2 font-bold text-2xl">
                    <img src={iconProfil} className="w-12 p-1" alt="foto" />
                    Informasi Pribadi
                    <hr className="w-[73%]" />
                </div>
                <div className="flex font-bold justify-between text-xs">
                    <div className="flex flex-col">
                    <h6>Nama :</h6>
                    <h6>Email :</h6>
                    <h6>Nomer Telepon :</h6>
                    <h6>Alamat :</h6>
                    <h6>Tanggal Lahir :</h6>
                    </div>
                    <div className="flex">
                        <span className="mt-2"> Deskripsi : </span>
                        <textarea className="w-lg bg-blue-100 ml-2 p-2 rounded-2xl" placeholder="Silahkan tulis deskripsi anda" />
                    </div>
                </div>
            </div>
            <div className=" rounded justify-between flex gap-4">
                <div className="mt-5 bg-gray-100 rounded p-2 gap-4 w-full">
                    <div className="flex items-center gap-2 font-bold text-2xl">
                        <img src={iconProfil} className="w-12 p-1" alt="foto" />
                        Keamanan
                    </div>
                    <div className="flex font-bold justify-between text-xs h-20">
                        <div className="flex flex-col">
                            <button className="mt-5 ml-5 p-3 font-bold text-white rounded-2xl bg-blue-600">Ganti Password</button>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 rounded mt-5 w-1/2 flex flex-col items-center">
                    <div className="flex justify-center p-3 font-bold text-2xl items-center">
                        <img src={iconKeluar} className="w-10 mr-1" alt="" />
                        Tindakan
                    </div>
                    <button className="mt-5 ml-5 p-2 w-25 font-bold text-white rounded-2xl bg-red-600">Keluar</button>
                </div>
            </div>
        </div>
    )
}

export default ProfilPage;