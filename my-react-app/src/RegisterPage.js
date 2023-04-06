import React, { useState } from 'react';
import axios from "axios";
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

        try {
            const response = await axios.post("https://pvefvkjla1.execute-api.us-east-1.amazonaws.com/product/login", {
                action: "register",
                email: email,
                username: username,
                password: password
            });

            const responseData = response.data;
            const responseBody = JSON.parse(response.data.body)

            if (responseData.statusCode === 400) {
                setErrorMessage(responseBody.message);
            } else if (responseData.statusCode === 200) {
                navigate("/login");
            }
        } catch (error) {
            console.error("Error during registration:", error.message);
        }
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
                            required
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
                            required
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
                            required
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
