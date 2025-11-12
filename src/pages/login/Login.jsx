import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });

      // ✅ FIX: Use correct role names (capitalized)
      setTimeout(() => {
        if (user.role === "Manager") nav("/manager/timesheets");
        else if (user.role === "HR") nav("/hr/employees"); // Changed from "hr" to "HR"
        else nav("/employee/attendance");
      }, 1200);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid email or password", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Employee Management Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <button className="register-btn" onClick={() => nav("/register")}>
            Register
          </button>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}