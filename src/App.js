// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    SettingOutlined,
    InfoCircleOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Header, Sider, Content } = Layout;

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppLayout() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <Layout style={{ minHeight: '100vh', width: '100vw' }}>
            <ToastContainer position="top-right" autoClose={3000} />

            {isAuthenticated ? (
                <>
                    {/* Header */}
                    <Header style={{ backgroundColor: '#333', padding: '0 20px', color: '#fff', display: 'flex', alignItems: 'center' }}>
                        <div style={{ color: '#50c878', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            Shiva Logistics
                        </div>
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ marginLeft: 'auto', backgroundColor: '#333' }}>
                            <Menu.Item key="1">
                                <a href="/home">Home</a>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <a href="/profile">Profile</a>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <a href="/settings">Settings</a>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <a href="/about">About</a>
                            </Menu.Item>
                            <Menu.Item key="5" onClick={logout}>
                                Logout
                            </Menu.Item>
                        </Menu>
                    </Header>

                    {/* Layout with Sider and Content */}
                    <Layout style={{ flex: 1 }}>
                        <Sider width={240} theme="dark" style={{ backgroundColor: '#1d1d1d', height: 'calc(100vh - 64px)', position: 'fixed', left: 0, top: 64 }}>
                            <Menu
                                theme="dark"
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                style={{ height: '100%', borderRight: 0 }}
                            >
                                <Menu.Item key="1" icon={<HomeOutlined />}>
                                    <a href="/home">Home</a>
                                </Menu.Item>
                                <Menu.Item key="2" icon={<UserOutlined />}>
                                    <a href="/profile">Profile</a>
                                </Menu.Item>
                                <Menu.Item key="3" icon={<SettingOutlined />}>
                                    <a href="/settings">Settings</a>
                                </Menu.Item>
                                <Menu.Item key="4" icon={<InfoCircleOutlined />}>
                                    <a href="/about">About</a>
                                </Menu.Item>
                                <Menu.Item key="5" icon={<LogoutOutlined />} onClick={logout}>
                                    Logout
                                </Menu.Item>
                            </Menu>
                        </Sider>

                        {/* Main Content */}
                        <Content style={{ marginLeft: 240, padding: '24px', backgroundColor: '#d4f0e7', minHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
                            <Routes>
                                <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                                <Route path="*" element={<Navigate to="/home" />} />
                            </Routes>
                        </Content>
                    </Layout>
                </>
            ) : (
                <Routes>
                    {/* Render Login Page if not authenticated */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </Layout>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppLayout />
            </Router>
        </AuthProvider>
    );
}

export default App;
