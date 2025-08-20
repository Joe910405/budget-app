const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 替換成你的 MongoDB Atlas 連線字串
const mongoURI = "mongodb+srv://waitaminute4560:LbmDPOTFagagOLeC@cluster0.b2idcnp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB 已連線"))
  .catch(err => console.error("❌ MongoDB 連線失敗", err));

// 建立 Schema
const transactionSchema = new mongoose.Schema({
  type: String,   // income / expense
  item: String,   // 項目
  amount: Number, // 金額
  date: { type: Date, default: Date.now }
});

// 建立 Model
const Transaction = mongoose.model("Transaction", transactionSchema);

// 上傳 API
app.post('/upload', async (req, res) => {
  try {
    const { records } = req.body;
    await Transaction.insertMany(records);
    res.json({ message: '成功上傳到 MongoDB！' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '上傳失敗！' });
  }
});

// 查詢 API（測試用，看看資料有沒有存進去）
app.get('/records', async (req, res) => {
  const records = await Transaction.find();
  res.json(records);
});

app.listen(3000, () => {
  console.log('伺服器運行中：http://localhost:3000');
});