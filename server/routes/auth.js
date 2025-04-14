const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Rotta per la registrazione
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Controlla se l'utente esiste già
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: "Utente già esistente" });

    // Cripta la password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea e salva il nuovo utente
    user = new User({ username, password: hashedPassword });
    await user.save();

    // Crea il payload per il token
    const payload = { userId: user._id };
    // Firma il token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore del server" });
  }
});

// Rotta per il login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Credenziali non valide" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Credenziali non valide" });

    // Crea il payload per il token
    const payload = { userId: user._id };
    // Firma il token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore del server" });
  }
});

module.exports = router;
