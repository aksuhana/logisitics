// src/App.js
import React,{ useState, useEffect } from 'react';
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
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/sidebarAnimations.css';

const { Header, Sider, Content } = Layout;

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}
const Clock = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            setTime(now.toLocaleTimeString('en-US', options));
        };

        updateTime(); // Initialize immediately
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    return <span style={{  marginLeft: 'auto',padding: '0px 20px',  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)',
        backgroundColor: '#50c878', borderRadius:'10px', fontWeight: 'bold', fontSize: '18px', color: '#fff' }}>{time}</span>;
};


// Header text component with subtle animation
function HeaderText() {
    return (
        <div className="header-title">
            SHIVGANGA LOGISTICS
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
        <Layout className="custom-layout">

            {isAuthenticated ? (
                <>
                    {/* Header */}
                    <div className='headerTop'>
                    <Header style={{ backgroundColor: '#333', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
                        <HeaderText />
                        <Clock />
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['1']}
                            className="header-menu"
                            style={{ marginLeft: 'auto', backgroundColor: '#333' }}
                        >
                            <Menu.Item key="1" icon={<HomeOutlined />}>
                                <a href="/home">Home</a>
                            </Menu.Item>
                            {/* <Menu.Item key="2">
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
                            </Menu.Item> */}
                            <Menu.Item key="2" onClick={logout}  icon={<LogoutOutlined />}>
                            <span className="sidebar-text">Logout</span>
                            </Menu.Item>
                        </Menu>
                        {/* Sidebar Toggle Button */}
                        {/* <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={toggleSidebar}
                            style={{ color: '#50c878', marginLeft: '10px' }}
                        /> */}
                    </Header>
                    </div>

                    {/* Layout with Sider and Content */}
                    <Layout style={{ flex: 1 }}>
                        {/* <Sider
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
                        </Sider> */}

                        {/* Main Content */}
                        <Content style={{ padding: '24px', backgroundColor: '#d4f0e7', minHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
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
        <ToastContainer position="bottom-center" autoClose={3000} transition={Flip} />
            <Router>
                <AppLayout />
            </Router>
        </AuthProvider>
    );
}

export default App;
