import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage({ onRegister }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://pvefvkjla1.execute-api.us-east-1.amazonaws.com/product/login", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                const response = JSON.parse(this.responseText);
                const responseBody = JSON.parse(response.body);

                if (response.statusCode === 400) {
                    setErrorMessage(responseBody.message);
                } else if (response.statusCode === 200) {
                    navigate("/login");
                }
            }
        };
        const data = JSON.stringify({ "action": "register", "email": email, "username": username, "password": password });
        xhr.send(data);
        return false;
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h2 className="register-title">Register</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="form-control"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            className="form-control"
                            placeholder="Username"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="form-control"
                            placeholder="Password"
                        />
                    </div>
                    <button type="submit" className="register-button">Register</button>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </form>
            </div>
        </div>

    );
}
export default RegisterPage;
