import React, { useState } from 'react';
import axios from "axios";
import "./LoginPage.css"; // Import the CSS file for LoginPage
import { useNavigate } from 'react-router-dom';

function LoginPage(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    login();   
  };

  const handleRegister = () => {
    navigate('/register');
  }

  async function login() {
    try {
      const response = await axios.post("https://pvefvkjla1.execute-api.us-east-1.amazonaws.com/product/login", {
        action: "login",
        email: email,
        password: password,
      });
  
      const responseData = response.data;
      const responseBody = JSON.parse(response.data.body)

      if (responseData.statusCode === 400) {
        setErrorMessage(responseBody.message);
      } else if (responseData.statusCode === 200) {
        localStorage.setItem("user_data", JSON.stringify(responseBody.user_data));
        props.onLogin();
      }
    } catch (err) {
      console.error("Error during login:", err.message);
    }
  }

  return (
    <div className="container centered">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-4">
          <div className="card login-card">
            <div className="card-body">
              <h1 className="text-left mb-4">Login</h1>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control my-2"
                    placeholder="Input your email"
                    required
                  />
                </div>
                <br></br>
                <div className="form-group">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control my-2"
                    placeholder="Input your password"
                    required
                  />
                </div>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <br></br>
                <div>
                  <button type="submit" className="btn btn-primary w-100 mt-2 mb-3 rounded-pill">
                    Login
                  </button>
                </div>
              </form>
              <p className="text-center mt-3">
                Don't have an account?{" "}
                <button className="text-primary rounded" onClick={handleRegister}>
                  Register here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
