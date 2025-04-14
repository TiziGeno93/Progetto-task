//Importo la libreria jsonwebtoken e l'assegno alla variabile jwt
const jwt = require("jsonwebtoken");

// Qui sto definendo una funzione middleware, esportandola.
module.exports = function (req, res, next) {
  // Qui recupero il token dall'header della richiesta, se non esiste (?) quindi undefined o null, non cercherà di usare la funzione split.
  const token = req.header("Authorization")?.split(" ")[1];
  //
  if (!token) {
    return res.status(401).json({ message: "Accesso negato. Token mancante." });
  }
  try {
    //Controllo se il token è valido e non sia stato manomesso, e che sia stato creato dal server.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Aggiungo i dati decodificati alla richiesta (come per esempio l'id dell'utente)
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token non valido" });
  }
};
