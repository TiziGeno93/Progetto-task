// Carica le variabili ambiente dal file .env
require("dotenv").config();

// Importa Express, Mongoose e CORS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Crea l'app Express
const app = express();

// Middleware: abilita il parsing del JSON e CORS
app.use(express.json());
app.use(cors());

// Qui creiamo la connessione per MongoDB con Mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connesso a MongoDB"))
  .catch((err) => console.error("Errore nella connessione a MongoDB:", err));

// Definisce una rotta di test per verificare il funzionamento del server
app.get("/", (req, res) => {
  res.send("Il backend è in esecuzione!");
});

// Importa le rotte per autenticazione e task
const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/tasks");

// Usa le rotte con prefissi API, il login ad esempio diventerà /api/auth/login
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

// Imposta la porta e avvia il server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
