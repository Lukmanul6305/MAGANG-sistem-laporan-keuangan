import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import iconProfil from "../assets/user.png";
import iconKeluar from "../assets/shutdown.png";
import defaultAvatar from "../assets/default-avatar.png";

const formatRupiah = (number) => {
  if (typeof number !== "number") number = 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const ProfilPage = ({ isOpen }) => {
  const [userId] = useState(localStorage.getItem("userId"));

  const [profileData, setProfileData] = useState({
    username: localStorage.getItem("loggedInUsername") || "Pengguna",
    email: "memuat...",
    nomer: "",
    alamat: "",
    ulangTahun: "",
    deskripsi: "",
    foto_profil: defaultAvatar,
    totalPemasukan: 0,
    totalPengeluaran: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/${userId}`);

        // ✅ PERBAIKAN DI SINI
        const data = response.data.payload;

        setProfileData({
          username: data.username || "Pengguna",
          email: data.email || "Tidak ada email",
          nomer: data.nomer || "",
          alamat: data.alamat || "",
          ulangTahun: data.ulangTahun ? new Date(data.ulangTahun).toISOString().split("T")[0] : "",
          deskripsi: data.deskripsi || "",
          foto_profil: data.foto_profil ? `http://localhost:5000${data.foto_profil}` : defaultAvatar,
          totalPemasukan: data.totalPemasukan || 0,
          totalPengeluaran: data.totalPengeluaran || 0,
        });
      } catch (error) {
        console.error("Gagal memuat data profil:", error);
        alert("Gagal memuat data profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    alert("Berhasil keluar.");
  };

  const handleInputChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert("Silakan pilih file gambar.");
    }
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("username", profileData.username);
    formData.append("nomer", profileData.nomer || "");
    formData.append("alamat", profileData.alamat || "");
    formData.append("ulangTahun", profileData.ulangTahun || "");
    formData.append("deskripsi", profileData.deskripsi || "");
    if (profileImageFile) {
      formData.append("foto_profil", profileImageFile);
    }

    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/profile/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.pesan || "Profil berhasil diperbarui!");
      localStorage.setItem("loggedInUsername", profileData.username);

      setIsEditing(false);
      setProfileImageFile(null);
      setImagePreview(null);

      const updatedProfileResponse = await axios.get(`http://localhost:5000/api/profile/${userId}`);
      const updatedData = updatedProfileResponse.data.payload;
      setProfileData((prev) => ({ ...prev, ...updatedData, foto_profil: updatedData.foto_profil ? `http://localhost:5000${updatedData.foto_profil}` : defaultAvatar }));
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.pesan || "Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) return alert("Password baru tidak cocok!");
    if (newPassword.length < 6) return alert("Password baru minimal 6 karakter!");
    try {
      const response = await axios.put(`http://localhost:5000/api/profile/${userId}/change-password`, {
        currentPassword,
        newPassword,
      });
      alert(response.data.pesan || "Password berhasil diubah!");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert(error.response?.data?.pesan || "Gagal mengubah password.");
    }
  };

  if (loading) return <p className="p-10 text-center">Memuat profil...</p>;

  return (
    <div className={`flex flex-col p-5 md:p-8 transition-all duration-300 ease-in-out ${isOpen ? " sm:ml-66 ml-45 lg:ml-64" : "lg:ml-20 sm:ml-20 ml-20"}`}>
      {/* Profil Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-6">
        <div className="flex items-center">
          <img src={imagePreview || profileData.foto_profil} className="w-32 h-32 bg-gray-200 rounded-full object-cover border-4 border-white shadow-lg" alt="Profil" />
          <div className="ml-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{profileData.username}</h1>
            <p className="text-md text-gray-500">{profileData.email}</p>
            <p className="text-md text-gray-500">{profileData.nomer || "No. Telepon belum diatur"}</p>
            <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full mt-3 hover:bg-blue-700 transition duration-300 shadow">
              {isEditing ? "Batal" : "Edit Profil"}
            </button>
          </div>
        </div>
      </div>

      {/* Form Edit */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="font-bold text-xl mb-4 border-b pb-2">Informasi Pribadi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Kiri */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Nama Pengguna</label>
              {isEditing ? <input type="text" name="username" value={profileData.username} onChange={handleInputChange} className="w-full p-2 border rounded-md" /> : <p className="p-2 bg-gray-100 rounded-md">{profileData.username}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
              <p className="p-2 bg-gray-100 rounded-md text-gray-500">{profileData.email} (tidak dapat diubah)</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">No. Telepon</label>
              {isEditing ? (
                <input type="tel" name="nomer" value={profileData.nomer} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
              ) : (
                <p className="p-2 bg-gray-100 rounded-md">{profileData.nomer || "Belum diatur"}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Tanggal Lahir</label>
              {isEditing ? (
                <input type="date" name="ulangTahun" value={profileData.ulangTahun} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
              ) : (
                <p className="p-2 bg-gray-100 rounded-md">{profileData.ulangTahun || "Belum diatur"}</p>
              )}
            </div>
          </div>

          {/* Kanan */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Alamat</label>
              {isEditing ? (
                <textarea name="alamat" value={profileData.alamat} onChange={handleInputChange} className="w-full p-2 border rounded-md h-24" />
              ) : (
                <p className="p-2 bg-gray-100 rounded-md min-h-[96px] whitespace-pre-wrap">{profileData.alamat || "Belum diatur"}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Deskripsi</label>
              {isEditing ? (
                <textarea name="deskripsi" value={profileData.deskripsi} onChange={handleInputChange} className="w-full p-2 border rounded-md h-24" />
              ) : (
                <p className="p-2 bg-gray-100 rounded-md min-h-[96px] whitespace-pre-wrap">{profileData.deskripsi || "Tidak ada deskripsi"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Ganti Foto dan Tombol Simpan */}
        {isEditing && (
          <div className="mt-6 border-t pt-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Ganti Foto Profil</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleUpdateProfile} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-300 shadow-lg">
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Keamanan dan Logout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg p-6 shadow-md text-center">
          <h3 className="font-bold text-xl mb-2">Keamanan</h3>
          <p className="text-sm text-gray-600 mb-4">Ubah password Anda secara berkala untuk menjaga keamanan akun.</p>
          <button onClick={() => setShowPasswordModal(true)} className="px-5 py-2 font-bold text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300">
            Ganti Password
          </button>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md text-center">
          <h3 className="font-bold text-xl mb-2">Tindakan Akun</h3>
          <p className="text-sm text-gray-600 mb-4">Keluar dari sesi Anda saat ini.</p>
          <button onClick={handleLogout} className="px-5 py-2 font-bold text-white rounded-lg bg-red-600 hover:bg-red-700 transition duration-300">
            Keluar
          </button>
        </div>
      </div>

      {/* Modal Ganti Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Ganti Password</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password Saat Ini:</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password Baru:</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded-md" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password Baru:</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded-md" />
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowPasswordModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Batal
              </button>
              <button onClick={handleChangePassword} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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
