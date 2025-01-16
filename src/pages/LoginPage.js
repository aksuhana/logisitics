// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';
import { ToastContainer, toast,Slide, Zoom, Flip } from 'react-toastify';
import { useAuth } from '../AuthContext';
import 'react-toastify/dist/ReactToastify.css';

import './LoginPage.css';

const { Title } = Typography;

function LoginPage() {
    const [inputSecret, setInputSecret] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const handleLogin = () => {
        console.log("inputSecret", inputSecret);
        login(inputSecret);
        if (isAuthenticated()) {
            console.log("inputSecret1", inputSecret);
            navigate('/home');
        } else {
            toast.error('Login failed: Invalid Key');
        }
    };

    return (
        <div className="login-container">
            <Title className='name-size' level={2}>SHIVGANGA LOGISTICS</Title>
            <Form
                name="loginForm"
                layout="vertical"
                onFinish={handleLogin}
            >
                <Form.Item
                    label="Secret Key"
                    name="secretKey"
                    rules={[{ required: true, message: 'Please enter your secret key!' }]}
                >
                    <Input.Password
                        placeholder="Enter Secret Key to Login"
                        value={inputSecret}
                        onChange={(e) => setInputSecret(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>            
            <div className="footer-text">
                <p>Need help? <a href="#">Contact Support</a></p>
            </div>
        </div>
    );
}

export default LoginPage;
