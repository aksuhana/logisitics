// src/components/Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

  

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
           
            <nav className="sidebar-nav">
                <a href="/home" className="sidebar-link">Home</a>
                <a href="/profile" className="sidebar-link">Profile</a>
                <a href="/settings" className="sidebar-link">Settings</a>
                <a href="/about" className="sidebar-link">About</a>
            </nav>
        </div>
    );
}

export default Sidebar;
