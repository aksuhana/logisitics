// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    SettingOutlined,
    InfoCircleOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import LoginPage from './pages/LoginPage';
import CrudPage from './pages/CrudPage';

import HomePage from './pages/HomePage';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/sidebarAnimations.css';

const { Header, Sider, Content } = Layout;

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}

// Header text component with subtle animation
function HeaderText() {
    return (
        <div className="header-title">
            Shiva Logistics
        </div>
    );
}

function AppLayout() {
    const { isAuthenticated, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout style={{ minHeight: '100vh', width: '100vw' }}>
            <ToastContainer position="top-right" autoClose={3000} />

            {isAuthenticated ? (
                <>
                    {/* Header */}
                    <div className='headerTop'>
                    <Header style={{ backgroundColor: '#333', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
                        <HeaderText />
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['1']}
                            className="header-menu"
                            style={{ marginLeft: 'auto', backgroundColor: '#333' }}
                        >
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
                            <Menu.Item key="5">
                                <a href="/crud">Crud</a>
                            </Menu.Item>
                            <Menu.Item key="6" onClick={logout}>
                                Logout
                            </Menu.Item>
                        </Menu>
                        {/* Sidebar Toggle Button */}
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={toggleSidebar}
                            style={{ color: '#50c878', marginLeft: '10px' }}
                        />
                    </Header>
                    </div>

                    {/* Layout with Sider and Content */}
                    <Layout style={{ flex: 1 }}>
                        <Sider
                            width={240}
                            theme="dark"
                            className={collapsed ? 'sidebar-hidden' : 'sidebar'}
                            style={{ backgroundColor: '#1d1d1d', height: 'calc(100vh - 64px)', position: 'fixed', left: 0, top: 64 }}
                        >
                            <Menu
                                theme="dark"
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                style={{ height: '100%', borderRight: 0 }}
                            >
                                <Menu.Item key="1" icon={<HomeOutlined />}>
                                    <a href="/home" className="sidebar-text">Home</a>
                                </Menu.Item>
                                <Menu.Item key="2" icon={<UserOutlined />}>
                                    <a href="/profile" className="sidebar-text">Profile</a>
                                </Menu.Item>
                                <Menu.Item key="3" icon={<SettingOutlined />}>
                                    <a href="/settings" className="sidebar-text">Settings</a>
                                </Menu.Item>
                                <Menu.Item key="4" icon={<InfoCircleOutlined />}>
                                    <a href="/about" className="sidebar-text">About</a>
                                </Menu.Item>
                                <Menu.Item key="5" icon={<InfoCircleOutlined />}>
                                    <a href="/crud" className="sidebar-text">Crud</a>
                                </Menu.Item>
                                <Menu.Item key="6" icon={<LogoutOutlined />} onClick={logout}>
                                    <span className="sidebar-text">Logout</span>
                                </Menu.Item>
                            </Menu>
                        </Sider>

                        {/* Main Content */}
                        <Content style={{ marginLeft: collapsed ? 0 : 240, padding: '24px', backgroundColor: '#d4f0e7', minHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
                            <Routes>
                                <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                                <Route path="/crud" element={<PrivateRoute><CrudPage /></PrivateRoute>} />
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
