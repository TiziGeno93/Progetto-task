import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../Api";
import { useAuth } from "../context/AuthContext";
import Header from "../Components/Header";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/login", { username, password });
      const token = response.data.token;
      // Salva il token nel contesto (e in localStorage grazie al provider)
      setToken(token);
      navigate("/tasks");
    } catch (error) {
      alert(
        "Login fallito: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="form-container">
          <h2>Login</h2>
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
            <button type="submit">Accedi</button>
            <p className="switch-form">
              Non hai un account? <Link to="/register">Registrati qui</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
