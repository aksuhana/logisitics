// src/pages/HomePage.js
import React from 'react';
import { Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './HomePage.css';

const { Title, Paragraph } = Typography;

function HomePage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Clear the token
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="home-container">
            <Title level={1}>Welcome to the Home Page</Title>
            <Paragraph>You are successfully logged in. Enjoy the Emerald-themed design!</Paragraph>
            <Button type="primary" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
}

export default HomePage;
