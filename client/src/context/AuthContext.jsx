import { createContext, useContext, useState, useEffect } from "react";

// Creo il contesto, che è una funzionalità di React per condividere i dati tra componenti senza doverli passare come props.
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Inizializza lo state prelevando il token da localStorage, se disponibile.
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Ogni volta che il token cambia, si salva o si rimuove da localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Funzione di logout per resettare il token
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizzato per usare il contesto
export function useAuth() {
  return useContext(AuthContext);
}
