import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import PublicInventoryPage from "./components/PublicInventoryPage";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [screen, setScreen] = useState("landing");
  const [role, setRole] = useState(null);

  const handleLoginSuccess = (userRole) => {
    setRole(userRole);
    setScreen("admin");
  };

  const handleLogout = () => {
    setRole(null);
    setScreen("landing");
  };

  if (screen === "login") {
    return (
      <div className="app-shell">
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setScreen("landing")}
        />
      </div>
    );
  }

  if (screen === "browse") {
    return (
      <div className="app-shell">
        <PublicInventoryPage onBack={() => setScreen("landing")} />
      </div>
    );
  }

  if (screen === "admin" && role === "ADMIN") {
    return (
      <div className="app-shell">
        <AdminDashboard onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <LandingPage
        onAdminClick={() => setScreen("login")}
        onBrowseClick={() => setScreen("browse")}
      />
    </div>
  );
}

export default App;
