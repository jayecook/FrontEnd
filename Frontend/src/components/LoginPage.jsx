import React, { useState } from "react";
import { loginUser } from "../api/authAPI";

function LoginPage({ onLoginSuccess, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const data = await loginUser(username, password);
      onLoginSuccess(data.role);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="card">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-row">
          <button type="submit">Login</button>
          <button type="button" onClick={onBack}>Back</button>
        </div>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default LoginPage;
