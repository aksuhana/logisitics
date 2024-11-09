// src/components/Header.js
import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <h1 className="header-title">Shiva Logistics</h1>
            <nav className="header-nav">
                <a href="/home" className="header-link">Home</a>
                <a href="/profile" className="header-link">Profile</a>
                <a href="/settings" className="header-link">Settings</a>
            </nav>
        </header>
    );
}

export default Header;
