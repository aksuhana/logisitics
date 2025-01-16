// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify'; // Import toast for notifications

const AuthContext = createContext();

// Pre-generated hash of "mySecretKey:SECRET_SALT" stored as a constant
const HASHED_SECRET = "4bbbc26888b654e7655fa9562d811be3111ab3d7596de3f34a909894dcb8a606";
const SECRET_SALT = "SECRET_SALT_LOGISTIC"; // Salt used to hash the input on the frontend

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));

    // Function to generate hash with user input + salt
    const generateHash = (inputSecret) => {
        return CryptoJS.SHA256(`${inputSecret}:${SECRET_SALT}`).toString();
    };

    // Derived state to determine if the user is authenticated
    console.log(authToken)
    const isAuthenticated = authToken === HASHED_SECRET;

    // Login function that validates the input by hashing and comparing with HASHED_SECRET
    const login = (inputSecret) => {
        const token = generateHash(inputSecret); // Hash the input with the salt
        console.log(token)
        if (token === HASHED_SECRET) {  // Compare hashed input with pre-generated hash
            setAuthToken(token);
            localStorage.setItem('authToken', token); // Store token in localStorage
            return true;
        } else {
            toast.error("Login failed: Invalid secret key"); // Show error toast on failed login
            return false;
        }
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken'); // Clear token from localStorage
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken !== HASHED_SECRET) {
            logout(); // Clear invalid token if it doesn't match the expected hash
        } else {
            setAuthToken(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
