import React from "react";
import "./LoginPage.css"; // Import the CSS file for LoginPage
import { useNavigate } from 'react-router-dom';

function LoginPage(props) {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    // Call the login function passing the onLogin function from props
    login(event, props.onLogin);   
  };

  const handleRegister = () => {
    navigate('/register');
  }

  function login(event, onLogin) {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://pvefvkjla1.execute-api.us-east-1.amazonaws.com/product/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {

      if (this.readyState === XMLHttpRequest.DONE) {
        var response = JSON.parse(this.responseText);
        var responseBody = JSON.parse(response.body);

        if (response.statusCode === 400) {
          document.getElementById("error-message").innerHTML = responseBody;
          document.getElementById("error-message").style.display = "block";
        } else if (response.statusCode === 200) {
          localStorage.setItem('user_data', JSON.stringify(responseBody.user_data));
          onLogin(); // Call the onLogin function passed from props
        }
      }
    };
    var data = JSON.stringify({ "action": "login", "email": email, "password": password });
    xhr.send(data);
    return false;
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
                    className="form-control my-2"
                    placeholder="Input your password"
                    required
                  />
                </div>
                <p id="error-message" style={{ color: "red", display: "none" }}></p>
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
