import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { signInWithGoogle } from "../firebase/auth";



function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/studytable"); 
    } catch (err) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="login-card" style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h3>Login</h3>
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
      <button className="signin" onClick={handleGoogleSignIn} style={{ width: "100%", background: "#8bfcb6", color: "#000000ff" }}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login