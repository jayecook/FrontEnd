import React from "react";

function LandingPage({ onAdminClick, onBrowseClick }) {
  return (
    <div className="card">
      <h1>Inventory Portal</h1>
      <p>Admins can sign in. Other users can browse inventory.</p>
      <div className="button-row">
        <button onClick={onAdminClick}>Admin Login</button>
        <button onClick={onBrowseClick}>Browse Inventory</button>
      </div>
    </div>
  );
}

export default LandingPage;
