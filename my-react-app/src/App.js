import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import RegisterPage from './RegisterPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedIn = () => {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        setLoggedIn(true);
      }
    }
    checkLoggedIn();
  }, []);

  const handleLogin = () => {
    // 在这里处理登录逻辑，如果登录成功，则将 loggedIn 状态设置为 true
    setLoggedIn(true);
  }

  const handleLogout = () => {
    localStorage.removeItem("user_data");
    setLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={loggedIn ? <Navigate to="/main" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/main" element={<MainPage onLogout={handleLogout} />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
