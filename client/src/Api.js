import axios from "axios";

// Creiamo un’istanza di Axios con la Base URL del back-end.
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Aggiungiamo un interceptor per includere il token in ogni richiesta
API.interceptors.request.use(
  (config) => {
    // Leggiamo il token dal localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Se il token è presente, lo allega all'header Authorization.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Se c'è un errore nella richiesta, lo propaghiamo
    return Promise.reject(error);
  }
);

export default API;
