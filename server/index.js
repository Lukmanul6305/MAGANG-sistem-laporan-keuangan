const express = require("express");
const db = require("../database/connection");
const dotenv = require("dotenv");
const cors = require("cors");
const { route } = require("./routes/users");
const path = require("path");

dotenv.config();
const app = express();
const port = 5000;

app.use(cors({ credentials: true, origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const routes = [
  { path: "/", route: require("./routes/users") },
  { path: "/kategori", route: require("./routes/kategori") },
  { path: "/transaksi", route: require("./routes/transaksi") },
  { path: "/laporan", route: require("./routes/laporan") },
  { path: "/profile", route: require("./routes/profile") },
];

routes.forEach((r) => app.use(`/api${r.path}`, r.route));



app.listen(port, () => {
  console.log(`website conneted port ${port}`);
});

// const usersRoute = require("./routes/users");
// const kategoriRoute = require("./routes/kategori");
// const transaksiRoute = require("./routes/tansaksi")
// const laporanRoute = require("./routes/laporan")

// app.use("/api", usersRoute);
// app.use("/api", kategoriRoute)
// app.use("/api", transaksiRoute)
// app.use("/api", laporanRoute)



// app.post("/kategori", (req, res) => {
//   const { nama_kategori, tipe } = req.body;
//   const sql = `INSERT INTO tb_kategori(nama_kategori,tipe) VALUES(?,?)`;
//   db.query(sql, [nama_kategori, tipe], (err, fields) => {
//     if (err) {
//       response(500, fields, "data gagal", res);
//     } else {
//       const data = {
//         isSuccess: fields.affectedRows,
//         id: fields.insertId,
//       };
//       response(200, data, "success", res);
//     }
//   });
// });

// app.post("/users", (req, res) => {
//   const { id, nama_lengkap, email, password, created_at } = req.body;
//   const sql = "INSERT INTO users(id,nama_lengkap, email, password, created_at) VALUES(?,?,?,?,?)";
//   db.query(sql, [id, nama_lengkap, email, password, created_at], (err, fields) => {
//     if (err) {
//       response(500, fields, "data gagal", res);
//       console.log(err);
//     } else {
//       const data = {
//         isSuccess: fields.affectedRows,
//         id: fields.insertId,
//       };
//       response(200, data, "success", res);
//     }
//   });
// });

// app.post("/laporan", (req, res) => {
//   const { user_id, jenis_laporan, periode_awal, periode_akhir, format, generated_at } = req.body;
//   const sql = "INSERT INTO tb_laporan(user_id, jenis_laporan, periode_awal, periode_akhir, format, generated_at) VALUES(?,?,?,?,?,?)";
//   db.query(sql, [user_id, jenis_laporan, periode_awal, periode_akhir, format, generated_at], (err, fields) => {
//     if (err) {
//       response(500, fields, "error", res);
//     } else {
//       const data = {
//         isSuccess: fields.affectedRows,
//         id: fields.insertId,
//       };
//       response(200, data, "berhasil", res);
//     }
//   });
// });

// app.post("/api/transaksi", (req, res) => {
//   const { user_id, kategori_id, tanggal, jumlah, deskripsi, tipe, created_at } = req.body;
//   const sql = "INSERT INTO tb_transaksi(user_id, kategori_id,tanggal, jumlah, deskripsi, tipe, created_at) VALUES(?,?,?,?,?,?,?)";
//   db.query(sql, [user_id, kategori_id, tanggal, jumlah, deskripsi, tipe, created_at], (err, fields) => {
//     if (err) {
//       response(500, err, "error", res);
//     } else {
//       const data = {
//         isSuccess: fields.affectedRows,
//         id: fields.insertId,
//       };
//       response(200, data, "berhasil", res);
//     }
//   });
// });
