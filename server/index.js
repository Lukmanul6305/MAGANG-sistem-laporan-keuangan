const express = require("express");
const app = express();
const port = 3000;
const db = require("../database/connection");
const response = require("./utils/response");
const usersRoute = require("./routes/users");
app.use(express.json());

app.get("/", (req, res) => {
  const sql = `SHOW TABLES`;
  db.query(sql, (err, fields) => {
    response(200, fields, "nama tabel", res);
  });
});

app.use("/api", usersRoute);

app.post("/kategori", (req, res) => {
  const { nama_kategori, tipe } = req.body;
  const sql = `INSERT INTO tb_kategori(nama_kategori,tipe) VALUES(?,?)`;
  db.query(sql, [nama_kategori, tipe], (err, fields) => {
    if (err) {
      response(500, fields, "data gagal", res);
    } else {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      };
      response(200, data, "success", res);
    }
  });
});

app.post("/users", (req, res) => {
  const { id, nama_lengkap, email, password, created_at } = req.body;
  const sql = "INSERT INTO users(id,nama_lengkap, email, password, created_at) VALUES(?,?,?,?,?)";
  db.query(sql, [id, nama_lengkap, email, password, created_at], (err, fields) => {
    if (err) {
      response(500, fields, "data gagal", res);
      console.log(err);
    } else {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      };
      response(200, data, "success", res);
    }
  });
});

app.post("/laporan", (req, res) => {
  const { user_id, jenis_laporan, periode_awal, periode_akhir, format, generated_at } = req.body;
  const sql = "INSERT INTO tb_laporan(user_id, jenis_laporan, periode_awal, periode_akhir, format, generated_at) VALUES(?,?,?,?,?,?)";
  db.query(sql, [user_id, jenis_laporan, periode_awal, periode_akhir, format, generated_at], (err, fields) => {
    if (err) {
      response(500, fields, "error", res);
    } else {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      };
      response(200, data, "berhasil", res);
    }
  });
});

app.post("/api/transaksi", (req, res) => {
  const { user_id, kategori_id, tanggal, jumlah, deskripsi, tipe, created_at } = req.body;
  const sql = "INSERT INTO tb_transaksi(user_id, kategori_id,tanggal, jumlah, deskripsi, tipe, created_at) VALUES(?,?,?,?,?,?,?)";
  db.query(sql, [user_id, kategori_id, tanggal, jumlah, deskripsi, tipe, created_at], (err, fields) => {
    if (err) {
      response(500, err, "error", res);
    } else {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      };
      response(200, data, "berhasil", res);
    }
  });
});

app.listen(port, () => {
  console.log(`website conneted port ${port}`);
});
