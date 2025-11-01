// src/components/Account.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_BASE || "") + "/api";

const Account = () => {
  const navigate = useNavigate();

  // toggle: 'login' | 'register'
  const [panel, setPanel] = useState("login");

  // ---------- LOGIN STATE ----------
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

  // ---------- REGISTER STATE ----------
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerMsg, setRegisterMsg] = useState("");

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const onMobileChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setRegisterMobile(digitsOnly.slice(0, 10));
  };

  // ---------- LOGIN ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg("");

    const username = loginUsername.trim();
    const password = loginPassword.trim();

    if (!username || !password) {
      setLoginMsg("Username and Password are required ❌");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("username", data?.user?.username || username);
        setLoginMsg("Login successful ✅");
        setTimeout(() => navigate("/"), 700);
      } else {
        setLoginMsg(data?.error || "Invalid credentials ❌");
      }
    } catch {
      setLoginMsg("Error connecting to server ❌");
    }
  };

  // ---------- REGISTER ----------
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterMsg("");

    const username = registerUsername.trim();
    const email = registerEmail.trim();
    const password = registerPassword.trim();
    const mobile = registerMobile.trim();

    if (!username) return setRegisterMsg("Username is required ❌");
    if (!email) return setRegisterMsg("Email is required ❌");
    if (!isValidEmail(email))
      return setRegisterMsg("Enter a valid email address ❌");
    if (!password) return setRegisterMsg("Password is required ❌");
    if (!/^\d{10}$/.test(mobile))
      return setRegisterMsg("Enter a valid 10-digit mobile number ❌");

    try {
      // Sign up (backend expects { mobile })
      const res = await fetch(`${API_BASE}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, mobile }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setRegisterMsg("User registered successfully ✅");

        // optional: auto-login
        const loginRes = await fetch(`${API_BASE}/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const loginData = await loginRes.json().catch(() => ({}));
        if (loginRes.ok) {
          localStorage.setItem("access_token", loginData.access);
          localStorage.setItem("refresh_token", loginData.refresh);
          localStorage.setItem(
            "username",
            loginData?.user?.username || username
          );
          setTimeout(() => navigate("/"), 700);
        } else {
          setPanel("login");
          setRegisterMsg("Registered. Please login.");
        }
      } else {
        setRegisterMsg(
          typeof data === "string"
            ? data
            : data?.error || "Registration failed ❌"
        );
      }
    } catch {
      setRegisterMsg("Error connecting to server ❌");
    }
  };

  // ---------- SCOPED CSS (unique classnames) ----------
  const styles = useMemo(
    () => `
    .acc-wrap { display:flex; justify-content:center; align-items:center; }
    .acc-container {
      position: relative; width: 950px; max-width: 100%; height: 550px; background: #fff;
      margin: 0 auto; border-radius: 30px; box-shadow: 0 0 30px rgba(0,0,0,.2); overflow: hidden;
    }
    .acc-container h1 { font-size: 36px; margin: -10px 0; }
    .acc-container p { font-size: 14.5px; margin: 15px 0; }
    .acc-form { width: 100%; }
    .acc-formBox {
      position: absolute; right: 0; width: 50%; height: 100%; background: #fff; display: flex; align-items: center;
      color: #333; text-align: center; padding: 40px; z-index: 1; transition: .6s ease-in-out 1.2s, visibility 0s 1s;
    }
    .acc-container.acc-active .acc-formBox { right: 50%; }
    .acc-formBox.acc-register { visibility: hidden; }
    .acc-container.acc-active .acc-formBox.acc-register { visibility: visible; }

    .acc-inputBox { position: relative; margin: 30px 0; text-align:left; }
    .acc-inputBox input {
      width: 100%; padding: 13px 50px 13px 20px; background: #eee; border-radius: 8px; border: none;
      outline: none; font-size: 16px; color: #333; font-weight: 500;
    }
    .acc-inputBox input::placeholder { color: #888; font-weight: 400; }
    .acc-inputBox i {
      position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 20px;
    }

    .acc-forgot { margin: -15px 0 15px; text-align:right; }
    .acc-forgot a { font-size: 14.5px; color: #333; }

    .acc-btn {
      width: 100%; height: 48px; background: #001d3d; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,.1);
      border: none; cursor: pointer; font-size: 16px; color: #fff; font-weight: 600;
    }

    .acc-toggleBox { position: absolute; width: 100%; height: 100%; }
    .acc-toggleBox::before {
      content: ''; position: absolute; left: -250%; width: 300%; height: 100%; background: #001d3d;
      border-radius: 150px; z-index: 2; transition: 1.8s ease-in-out;
    }
    .acc-container.acc-active .acc-toggleBox::before { left: 50%; }

    .acc-togglePanel {
      position: absolute; width: 50%; height: 100%; color: #fff; display: flex; flex-direction: column;
      justify-content: center; align-items: center; z-index: 2; transition: .6s ease-in-out;
      text-align:center; padding: 0 24px;
    }
    .acc-togglePanel.acc-left { left: 0; transition-delay: 1.2s; }
    .acc-container.acc-active .acc-togglePanel.acc-left { left: -50%; transition-delay: .6s; }
    .acc-togglePanel.acc-right { right: -50%; transition-delay: .6s; }
    .acc-container.acc-active .acc-togglePanel.acc-right { right: 0; transition-delay: 1.2s; }
    .acc-togglePanel p { margin-bottom: 20px; }
    .acc-togglePanel .acc-btnGhost {
      width: 160px; height: 46px; background: transparent; border: 2px solid #fff; box-shadow: none; border-radius:8px;
      color:#fff; cursor:pointer; font-weight:600;
    }

    .acc-msg { margin-top: 10px; font-size: 14px; }
    .acc-msg.err { color: #c43737; font-weight: 600; }
    .acc-msg.ok { color: #0a8f4a; font-weight: 600; }

    @media screen and (max-width: 650px){
      .acc-container { height: calc(100vh - 5px); }
      .acc-formBox { bottom: 0; width: 100%; height: 70%; right: 0; }
      .acc-container.acc-active .acc-formBox { right: 0; bottom: 30%; }
      .acc-toggleBox::before { left: 0; top: -270%; width: 100%; height: 300%; border-radius: 20vw; }
      .acc-container.acc-active .acc-toggleBox::before { left: 0; top: 70%; }
      .acc-container.acc-active .acc-togglePanel.acc-left { left: 0; top: -30%; }
      .acc-togglePanel { width: 100%; height: 30%; }
      .acc-togglePanel.acc-left { top: 0; }
      .acc-togglePanel.acc-right { right: 0; bottom: -30%; }
      .acc-container.acc-active .acc-togglePanel.acc-right { bottom: 0; }
    }

    @media screen and (max-width: 400px){
      .acc-formBox { padding: 20px; }
      .acc-togglePanel h1 { font-size: 30px; }
    }
  `,
    []
  );

  return (
    <section className="py-80 acc-wrap">
      {/* scoped styles */}
      <style>{styles}</style>

      <div
        className={`acc-container ${panel === "register" ? "acc-active" : ""}`}
      >
        {/* LOGIN FORM */}
        <div className="acc-formBox acc-login">
          <form className="acc-form" onSubmit={handleLogin}>
            <div style={{ width: "100%" }}>
              <h1>Login</h1>

              <div className="acc-inputBox">
                <input
                  type="text"
                  placeholder="Username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
                <i className="bx bxs-user" />
              </div>

              <div className="acc-inputBox">
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <i className="bx bxs-lock-alt" />
              </div>

              <div className="acc-forgot">
                <a href="#">Forgot Password?</a>
              </div>

              <button type="submit" className="acc-btn">
                Login
              </button>

              {!!loginMsg && (
                <p className={`acc-msg ${/✅/.test(loginMsg) ? "ok" : "err"}`}>
                  {loginMsg}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* REGISTER FORM */}
        <div className="acc-formBox acc-register">
          <form className="acc-form" onSubmit={handleRegister}>
            <div style={{ width: "100%" }}>
              <h1>Registration</h1>

              <div className="acc-inputBox">
                <input
                  type="text"
                  placeholder="Username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                />
                <i className="bx bxs-user" />
              </div>

              <div className="acc-inputBox">
                <input
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
                <i className="bx bxs-envelope" />
              </div>

              <div className="acc-inputBox">
                <input
                  type="tel"
                  placeholder="10-digit Mobile Number"
                  value={registerMobile}
                  onChange={onMobileChange}
                  inputMode="numeric"
                  maxLength={10}
                  required
                />
                <i className="bx bxs-phone" />
              </div>

              <div className="acc-inputBox">
                <input
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
                <i className="bx bxs-lock-alt" />
              </div>

              <button type="submit" className="acc-btn">
                Register
              </button>

              {!!registerMsg && (
                <p
                  className={`acc-msg ${/✅/.test(registerMsg) ? "ok" : "err"}`}
                >
                  {registerMsg}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* TOGGLE PANELS */}
        <div className="acc-toggleBox">
          <div className="acc-togglePanel acc-left">
            <h1 style={{color:"white"}}>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button
              type="button"
              className="acc-btnGhost"
              onClick={() => setPanel("register")}
            >
              Register
            </button>
          </div>

          <div className="acc-togglePanel acc-right">
            <h1 style={{color:"white"}}>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              type="button"
              className="acc-btnGhost"
              onClick={() => setPanel("login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
