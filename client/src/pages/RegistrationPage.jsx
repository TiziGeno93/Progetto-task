import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Api";
import { useAuth } from "../context/AuthContext";
import Header from "../Components/Header";

function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Le password non coincidono.");
      return;
    }
    try {
      const response = await API.post("/auth/register", { username, password });
      // Estraggo il token dalla response
      const token = response.data.token;
      setToken(token);
      navigate("/tasks");
    } catch (error) {
      alert(
        "Registrazione fallita: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="form-container">
          <h2>Registrazione</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="confirmPassword">Conferma Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Registrati</button>
            <button className="tornaIndietro" onClick={handleGoBack}>
              Torna indietro
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegistrationPage;
