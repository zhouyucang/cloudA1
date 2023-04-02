import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./MainPage.css"; // Import the CSS file for LoginPage
import "bootstrap/dist/css/bootstrap.min.css"; // 


const API_GATEWAY_URL = 'https://pvefvkjla1.execute-api.us-east-1.amazonaws.com/product/login'


function UserArea({ userName, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <div className="user-area" style={{ marginBottom: "2rem" }}>
            <h2 className="custom-title">User Area</h2>
            <h3 className="custom-subtitle">Welcome, {userName}!</h3>
            <button onClick={handleLogout} className="logout-link">Log out</button>
        </div>
    );
}

function SubscriptionArea({ subscriptions, setSubscriptions, onRemoveSubscription }) {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    useEffect(() => {
        if (userData) {
            getSubscriptions(userData.email, setSubscriptions);
        } else {
            console.error("User data not found in localStorage");
        }
    }, []);

    return (
        <div className="subscription-area">
            <h2 className="custom-title">Your music</h2>
            <div id="subscriptions">
                {subscriptions && subscriptions.map((item, index) => (
                    <div key={index} className="result-card">
                        <img
                            src={item.img_url ? item.img_url : "https://via.placeholder.com/50"}
                            alt={item.artist}
                            height={50}
                        />
                        <div>
                            {item.title} - {item.artist} ({item.year})
                        </div>
                        <button onClick={() => onRemoveSubscription(item.title)} className="btn btn-danger">
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

async function query(title, artist, year) {

    try {
        const response = await axios.post(API_GATEWAY_URL, {
            action: "query",
            title,
            artist,
            year,
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Error during query");
        }
    } catch (err) {
        console.error("Error during query:", err.message);
        throw err;
    }
}


async function addSubscription(item) {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    try {
        const response = await axios.post(API_GATEWAY_URL, {
            action: "add_subscription",
            email: userData.email,
            title: item.title,
            artist: item.artist,
            year: item.year,
            img_url: item.image_url 
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Error during adding subscription");
        }
    } catch (err) {
        console.error("Error during adding subscription:", err.message);
        throw err;
    }
}


function QueryArea({ onAddSubscription, setSubscriptions }) {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [year, setYear] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const userData = JSON.parse(localStorage.getItem("user_data"));


    const handleQuery = async (e) => {
        e.preventDefault();
        try {
            const response = await query(title, artist, year);
            const data = JSON.parse(response.body);
            setResults(data.results);
        } catch (err) {
            setError("Error during query, please try again later.");
        }
    };

    const handleAddSubscription = async (item) => {
        try {
            await onAddSubscription(item);

            setShowSuccess(true);

            setTimeout(() => setShowSuccess(false), 3000);

            setResults(results.filter((result) => result.title !== item.title));

            getSubscriptions(userData.email, setSubscriptions).then((updatedSubs) => {
                setSubscriptions(updatedSubs);
            });
        } catch (err) {
            setError("Error during adding subscription, please try again later.");
        }
    };


    return (
        <div className="query-area">
            <h2 className="custom-title">search your music</h2>
            <form onSubmit={handleQuery}>
                <div className="form-group">
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                        placeholder="Title"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        id="artist"
                        name="artist"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        className="form-control"
                        placeholder="Artist"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        id="year"
                        name="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="form-control"
                        placeholder="Year"
                    />
                </div>
                <input type="submit" value="Query" className="btn btn-primary" />
            </form>

            <div
                id="success"
                style={{
                    display: showSuccess ? "block" : "none",
                    backgroundColor: "green",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    position: "fixed",
                    top: "10px",
                    right: "10px",
                    zIndex: 1000,
                }}
            >
                Subscription successful!
            </div>
            <br></br>
            <div id="error" style={{ color: "red" }}>
                {error}
            </div>
            <div id="results">
                {results.length > 0 ? (
                    results.map((item, index) => (
                        <div key={index} className="result-card">
                            <img
                                src={item.image_url ? item.image_url : "https://via.placeholder.com/50"}
                                alt={item.artist}
                                height={50}
                            />
                            <div>
                                {item.title} - {item.artist} ({item.year})
                            </div>
                            <button onClick={() => handleAddSubscription(item)} className="btn btn-primary">
                                Subscribe
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
}

async function getSubscriptions(userEmail, setSubscriptions) {
    try {
        const response = await axios.post(API_GATEWAY_URL, {
            action: "get_subscriptions",
            user_email: userEmail,
        });
        console.log(response)
        if (response.status === 200) {
            const subs = Array.isArray(response.data) ? response.data : [];
            setSubscriptions(subs);
            return subs;
        } else {
            throw new Error("Error getting subscriptions");
        }
    } catch (err) {
        console.error("Error during getting subscriptions:", err.message);
    }
}


async function removeSubscription(title, setSubscriptions) {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    const userEmail = userData.email;

    try {
        const response = await fetch(API_GATEWAY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: "remove_subscription", email: userEmail, title: title }),
        });

        if (response.ok) {
            console.log("Subscription removed successfully");
            getSubscriptions(userEmail, setSubscriptions);
        } else {
            console.error("Error removing subscription:", await response.text());
        }
    } catch (err) {
        console.error("Error removing subscription:", err.message);
    }
}

function CustomTabs({ subs, onRemoveSubscription, onAddSubscription }) {
    const [subscriptions, setSubscriptions] = useState(subs);

    return (
        <Tabs defaultActiveKey="subscription">
            <Tab
                eventKey="subscription"
                title="Subscription Area"
                className="custom-tab"
            >
                <SubscriptionArea
                    subscriptions={subscriptions}
                    setSubscriptions={setSubscriptions}
                    onRemoveSubscription={(title) =>
                        onRemoveSubscription(title, setSubscriptions)
                    }
                />
            </Tab>
            <Tab eventKey="query" title="Query Area" className="custom-tab">
                <QueryArea
                    onAddSubscription={onAddSubscription}
                    setSubscriptions={setSubscriptions}
                />
            </Tab>
        </Tabs>
    );
}


function MainPage({ onLogout }) {

    const [subscriptions, setSubscriptions] = useState([]);
    const userData = JSON.parse(localStorage.getItem('user_data')) || { user_name: 'Guest' };


    useEffect(() => {
        getSubscriptions(userData.email, setSubscriptions).then((subs) => {
            setSubscriptions(subs);
        });
    }, []);

    return (
        <div
            className="container"
            style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "2rem",
                marginTop: "2rem",
                marginBottom: "2rem",
            }}
        >
            <div className="row justify-content-center">
                <UserArea userName={userData.user_name} onLogout={onLogout} />
                <CustomTabs
                    subs={subscriptions}
                    onRemoveSubscription={removeSubscription}
                    onAddSubscription={addSubscription}
                />
            </div>
        </div>
    );
}


export default MainPage;
