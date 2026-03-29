const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 Datenbank verbinden
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB verbunden"))
.catch(err => console.log(err));

// 👤 User Schema
const User = mongoose.model("User", {
  email: String,
  password: String
});

// ✅ Registrierung
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashed });
  await user.save();

  res.json({ message: "Registriert" });
});

// 🔐 Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User nicht gefunden" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Falsches Passwort" });

  res.json({ message: "Login erfolgreich" });
});

// 🌐 Server starten
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server läuft"));
