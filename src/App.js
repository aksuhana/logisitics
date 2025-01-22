// src/App.js
import React,{ useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Modal,message,Layout, Menu, Button } from 'antd';
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

    return <span style={clockStyle}>{time}</span>;
};

const headerTextStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '28px',
    color: '#fff',
    fontWeight: 'bold',
    animation: 'fadeIn 2s ease-out', // Adding fade-in animation to the title
};

const titleStyle = {
    fontSize: '32px',
    letterSpacing: '2px',
    fontFamily: "'Poppins', sans-serif", // You can also try different fonts
};

const clockStyle = {
    marginLeft: 'auto',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '24px',
    color: '#fff',
    transition: 'all 0.3s ease', // Smooth transition effect
};

const headerStyle = {
    background: 'linear-gradient(45deg, #50c878, rgb(39,39,39))', // Gradient background
    padding: '10px 0px 10px 15px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};


// Header text component with subtle animation
function HeaderText() {
    return (
        <div className="header-title" style={headerTextStyle}>
            <span style={titleStyle}>SHIVGANGA LOGISTICS</span>
        </div>
    );
}

function AppLayout() {
    const { isAuthenticated, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const confirmLogout = () => {
        Modal.confirm({
          title: 'Confirm Logout',
          icon: <LogoutOutlined />,
          content: 'Are you sure you want to logout?',
          okText: 'Yes',
          cancelText: 'No',
          onOk() {
            try {
              logout();
              message.success('Successfully logged out.');
              // Optionally, redirect the user after logout
              // history.push('/login'); // if using react-router
            } catch (error) {
              console.error('Logout failed:', error);
              message.error('Logout failed. Please try again.');
            }
          },
          onCancel() {
            // Optional: Handle cancellation if needed
            console.log('Logout canceled');
          },
        });
      };

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout className="custom-layout">

            {isAuthenticated ? (
                <>
                    {/* Header */}
                    {/* Header */}
                    <div className="headerTop">
                        <Header style={headerStyle}>
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
                                <Menu.Item key="2" onClick={confirmLogout} icon={<LogoutOutlined />}>
                                    <span className="sidebar-text">Logout</span>
                                </Menu.Item>
                            </Menu>
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
