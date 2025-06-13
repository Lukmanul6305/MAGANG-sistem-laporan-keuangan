import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import iconProfil from "../assets/user.png"; // Pastikan path ini benar
import iconKeluar from "../assets/shutdown.png"; // Pastikan path ini benar

const ProfilPage = ({ isOpen, userId }) => {
  // State untuk menyimpan semua data profil yang diambil dari backend
  const [profileData, setProfileData] = useState({
    username: "", // Dari tb_users
    email: "", // Dari tb_users
    nomer: "", // Dari tb_users
    alamat: "", // Dari tb_users
    ulangTahun: "", // Dari tb_users
    deskripsi: "", // Dari tb_transaksi (tipe 'DeskripsiProfil')
    totalPemasukan: 0, // Agregasi dari tb_transaksi
    totalPengeluaran: 0, // Agregasi dari tb_transaksi
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // --- PERUBAHAN UTAMA: State untuk nama tampilan, diambil dari localStorage duluan ---
  const [displayName, setDisplayName] = useState(localStorage.getItem("loggedInUsername") || "Pengguna");
  const [displayEmail, setDisplayEmail] = useState(localStorage.getItem("email") || "email belum tertampilkan");
  // --- AKHIR PERUBAHAN ---

  const navigate = useNavigate();

  // Konfigurasi Axios untuk mengirim credentials (tidak lagi mutlak jika tidak pakai session)
  // Tapi biarkan saja untuk kompatibilitas jika nanti kembali ke session
  axios.defaults.withCredentials = true;

  // Fungsi untuk mengambil data profil dari backend
  const fetchProfile = async () => {
    console.log("Attempting to fetch profile for User ID:", userId);
    try {
      // Mengirim userId di URL (GET request)
      const response = await axios.get(`http://localhost:5000/api/profile/${userId}`);
      console.log("Profile fetch successful. Response data:", response.data);

      const data = response.data.data; // Asumsi struktur { data: {...} }

      setProfileData({
        username: data.username || "",
        email: data.email || "",
        nomer: data.nomer || "",
        alamat: data.alamat || "",
        ulangTahun: data.ulangTahun ? new Date(data.ulangTahun).toISOString().split("T")[0] : "",
        deskripsi: data.deskripsi || "",
        totalPemasukan: data.totalPemasukan || 0,
        totalPengeluaran: data.totalPengeluaran || 0,
      });
      // --- PERUBAHAN: Update nama tampilan setelah data backend didapatkan ---
      setDisplayName(data.username || "Pengguna");
      setDisplayEmail(data.email || "email tidak ada");
      // --- AKHIR PERUBAHAN ---
    } catch (error) {
      console.error("Error fetching profile data. Details:", error.response || error.message || error);
      alert(`Gagal memuat data profil: ${error.response?.data?.message || "Terjadi kesalahan."}`);
      // Tidak perlu redirect ke login jika 401, karena tidak pakai session lagi secara ketat
      // localStorage.removeItem('userId'); // Tidak perlu hapus, karena tidak dikelola ketat
      // localStorage.removeItem('loggedInUsername');
      // navigate("/login");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, navigate]); // Dependensi `userId` akan memicu `useEffect` saat `userId` berubah.

  const Logout = async () => {
    // Logout sederhana, hanya hapus data lokal dan redirect
    localStorage.removeItem("userId");
    localStorage.removeItem("loggedInUsername");
    navigate("/");
    alert("Berhasil keluar.");
    // Tidak ada permintaan DELETE ke backend untuk logout jika tidak pakai sesi
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    const payload = {
      // userId: userId, // TIDAK PERLU DI PAYLOAD, SUDAH ADA DI URL PARAMETER
      username: profileData.username,
      email: profileData.email, // Email tidak akan diubah di backend via PUT ini
      nomer: profileData.nomer,
      alamat: profileData.alamat,
      ulangTahun: profileData.ulangTahun,
      deskripsi: profileData.deskripsi,
    };
    console.log("Sending update profile payload:", payload);

    try {
      // Mengirim userId di URL (PUT request)
      const response = await axios.put(`http://localhost:5000/api/profile/${userId}`, payload);
      console.log("Response from /api/profile (PUT):", response.data);

      setIsEditing(false); // Keluar dari mode edit setelah berhasil update
      alert(response.data.message || "Profil berhasil diperbarui!");
      localStorage.setItem("loggedInUsername", profileData.username); // Update localStorage juga
      fetchProfile(); // Refresh data setelah update
    } catch (error) {
      console.error("Error updating profile. Details:", error.response || error.message || error);
      const errorMessage = error.response?.data?.message || "Gagal memperbarui profil. Silakan coba lagi.";
      alert(errorMessage);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Semua field password harus diisi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password baru minimal 6 karakter!");
      return;
    }

    const payload = {
      // userId: userId, // TIDAK PERLU DI PAYLOAD, SUDAH ADA DI URL PARAMETER
      currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword,
    };
    console.log("Sending change password payload:", payload);

    try {
      // Mengirim userId di URL (PUT request)
      const response = await axios.put(`http://localhost:5000/api/profile/${userId}/change-password`, payload);
      console.log("Response from /api/profile/change-password:", response.data);

      alert(response.data.message || "Password berhasil diganti!");
      setCurrentPassword(""); // Kosongkan input password setelah berhasil
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false); // Tutup modal setelah berhasil
    } catch (error) {
      console.error("Error changing password. Details:", error.response || error.message || error);
      const errorMessage = error.response?.data?.message || "Gagal mengganti password. Silakan coba lagi.";
      alert(errorMessage);
    }
  };

  return (
    <div className={`flex flex-col p-10 transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-70" : "lg:ml-20"} max-w-full`}>
      {/* Bagian Atas Profil */}
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-start">
          <img src="https://images.icon-icons.com/2859/PNG/512/avatar_face_man_boy_profile_smiley_happy_people_icon_181659.png" className="w-40 h-40 bg-blue-200 rounded-full object-cover" alt="Profil Avatar" />
          <div className="ml-5">
            {/* Menggunakan displayName untuk nama tampilan utama */}
            <h1 className="text-4xl font-bold">{displayName || "Nama Pengguna"}</h1>
            {/* Informasi lainnya tetap dari profileData yang dimuat dari backend */}
            <h6 className="text-lg">Email : {displayEmail || "Tidak ada email"}</h6>
            <h6 className="text-lg">Nomer Telepon : {profileData.nomer || "Tidak ada telepon"}</h6>
            <button onClick={() => setIsEditing(!isEditing)} className="p-2 bg-blue-600 rounded-2xl text-xs font-bold text-white mt-3 hover:bg-blue-700 transition duration-300">
              {isEditing ? "Batal Edit" : "Edit Profil"}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-5 justify-center">
          <div className="flex flex-col items-center p-5 shadow-md rounded-lg text-sm text-blue-600 font-bold bg-white min-w-[200px]">
            Total Pemasukan<span className="text-xl">Rp {profileData.totalPemasukan.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex flex-col items-center p-5 shadow-md rounded-lg text-sm text-blue-600 font-bold bg-white min-w-[200px]">
            Total Pengeluaran <span className="text-xl">Rp {profileData.totalPengeluaran.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* Bagian Informasi Pribadi */}
      <div className="mt-5 bg-gray-100 rounded p-5 shadow-md">
        <div className="flex items-center gap-2 font-bold text-2xl mb-4">
          <img src={iconProfil} className="w-12 p-1" alt="foto" />
          Informasi Pribadi
          <hr className="flex-grow border-t-2 border-gray-300" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-bold text-base">
          <div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1">Nama:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username" // Name attribute cocok dengan properti state: profileData.username
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="p-2 bg-blue-50 rounded-md">{displayName || profileData.username}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1">Email:</label>
              <p className="p-2 bg-blue-50 rounded-md">{profileData.email || "Tidak ada data"}</p>
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1">Nomer Telepon:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nomer" // Name attribute cocok dengan properti state: profileData.nomer
                  value={profileData.nomer}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="p-2 bg-blue-50 rounded-md">{profileData.nomer || "Tidak ada data"}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1">Alamat:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="alamat" // Name attribute cocok dengan properti state: profileData.alamat
                  value={profileData.alamat}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="p-2 bg-blue-50 rounded-md">{profileData.alamat || "Tidak ada data"}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1">Tanggal Lahir:</label>
              {isEditing ? (
                <input
                  type="date"
                  name="ulangTahun" // Name attribute cocok dengan properti state: profileData.ulangTahun
                  value={profileData.ulangTahun}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="p-2 bg-blue-50 rounded-md">{profileData.ulangTahun || "Tidak ada data"}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Deskripsi:</label>
            {isEditing ? (
              <textarea
                name="deskripsi" // Name attribute cocok dengan properti state: profileData.deskripsi
                value={profileData.deskripsi}
                onChange={handleInputChange}
                className="w-full bg-blue-100 p-2 rounded-2xl min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Silakan tulis deskripsi Anda"
              />
            ) : (
              <p className="p-2 bg-blue-50 rounded-2xl min-h-[150px] whitespace-pre-wrap">{profileData.deskripsi || "Tidak ada deskripsi"}</p>
            )}
            {isEditing && (
              <button onClick={handleUpdateProfile} className="p-3 bg-green-600 rounded-md text-white font-bold mt-4 w-full hover:bg-green-700 transition duration-300">
                Simpan Perubahan
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div className="bg-gray-100 rounded p-5 shadow-md">
          <div className="flex items-center gap-2 font-bold text-2xl mb-4">
            <img src={iconProfil} className="w-12 p-1" alt="foto" />
            Keamanan
          </div>
          <div className="flex justify-center text-sm">
            <button onClick={() => setShowPasswordModal(true)} className="mt-5 p-3 font-bold text-white rounded-2xl bg-blue-600 hover:bg-blue-700 transition duration-300">
              Ganti Password
            </button>
          </div>
        </div>
        <div className="bg-gray-100 rounded p-5 shadow-md flex flex-col items-center justify-center">
          <div className="flex justify-center p-3 font-bold text-2xl items-center mb-4">
            <img src={iconKeluar} className="w-10 mr-1" alt="" />
            Tindakan
          </div>
          <button onClick={Logout} className="p-3 w-40 font-bold text-white rounded-2xl bg-red-600 hover:bg-red-700 transition duration-300">
            Keluar
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Ganti Password</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password Saat Ini:</label>
              <input
                type="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password Baru:</label>
              <input
                type="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password Baru:</label>
              <input
                type="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowPasswordModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300">
                Batal
              </button>
              <button onClick={handleChangePassword} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300">
                Ganti Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilPage;
