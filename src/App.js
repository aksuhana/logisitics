// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { useAuth } from './AuthContext';

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated() ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated() ? children : <Navigate to="/home" />;
}

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <HomePage />
                        </PrivateRoute>
                    }
                />
                {/* Catch-all route to redirect based on authentication status */}
                <Route path="*" element={<Navigate to={isAuthenticated() ? "/home" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;
