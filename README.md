This documentation provides a step-by-step guide for setting up and running the Login Page Application. This project is built using React and Ant Design for UI components, with React-Toastify for toast notifications. It includes custom styling, animations, and error handling for an enhanced user experience.

Table of Contents
Installation
Project Structure
Configuration
Usage Instructions
Styling and Animations
Troubleshooting
Installation
Prerequisites
Ensure you have the following installed:

Node.js (with npm)
React (Create React App)
Ant Design and React-Toastify for additional UI and notifications
Step 1: Clone the Repository
Clone this repository to your local machine and navigate to the project directory:

bash
Copy code
git clone <repository_url>
cd <repository_name>
Step 2: Install Dependencies
Install the required dependencies by running:

bash
Copy code
npm install
This command installs:

Ant Design: For styled UI components
React-Toastify: For toast notifications
Other dependencies needed for a basic React project
Project Structure
The main files for the login functionality are:

src/pages/LoginPage.js: Contains the main component for the login form and functionality.
src/pages/LoginPage.css: Contains custom CSS for styling the login page, including animations and effects.
src/AuthContext.js: Manages authentication state and logic.
Configuration
1. Setting Up react-toastify
To display toast notifications, we use React-Toastify. Ensure the following import statements are included at the top of LoginPage.js:

javascript
Copy code
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
ToastContainer is necessary to render toasts. Include it once in your component's JSX.
Use toast.error to display an error notification on login failure.
2. Styling with Ant Design and Custom CSS
The application uses Ant Design components and custom CSS to enhance the user interface. This includes:

Input field styling using Ant Design.
Custom animations and colors defined in LoginPage.css.
Usage Instructions
Start the Application: Run the following command to start the development server:

bash
Copy code
npm start
This will start the application at http://localhost:3000.

Login with Secret Key:

Enter the secret key 1234 to log in.
If the secret key is incorrect, a bottom-centered toast notification will display an error message saying, Login failed: Invalid secret key.
Components
LoginPage.js
This file contains the main login functionality, including form handling, validation, and toast notifications.

Here’s the complete code for LoginPage.js:

javascript
Copy code
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../AuthContext';
import './LoginPage.css';

const { Title } = Typography;

function LoginPage() {
    const [inputSecret, setInputSecret] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const handleLogin = () => {
        login(inputSecret);
        if (isAuthenticated()) {
            navigate('/home');
        } else {
            toast.error('Login failed: Invalid secret key', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <div className="login-container">
            <Title level={2}>Login</Title>
            <Form name="loginForm" layout="vertical" onFinish={handleLogin}>
                <Form.Item
                    label="Secret Key"
                    name="secretKey"
                    rules={[{ required: true, message: 'Please enter your secret key!' }]}
                >
                    <Input.Password
                        placeholder="Secret Key"
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
            <ToastContainer />
            <div className="footer-text">
                <p>Need help? <a href="#">Contact Support</a></p>
            </div>
        </div>
    );
}

export default LoginPage;
LoginPage.css
This file includes CSS for styling, animations, and transitions. Here’s the code:

css
Copy code
/* src/pages/LoginPage.css */

:root {
    --emerald-green: #50c878;
    --dark-emerald: #3a9b66;
    --light-emerald: #8fd1b9;
    --white: #ffffff;
    --shadow-color: rgba(0, 0, 0, 0.2);
}

.login-container {
    background-color: var(--emerald-green);
    padding: 40px;
    max-width: 400px;
    margin: 50px auto;
    border-radius: 12px;
    box-shadow: 0px 8px 15px var(--shadow-color);
    text-align: center;
    color: var(--white);
    position: relative;
    overflow: hidden;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.ant-input,
.ant-input-password {
    background-color: var(--light-emerald);
    border: none;
    border-radius: 5px;
    box-shadow: inset 0px 0px 5px var(--shadow-color);
    color: #333;
    font-weight: bold;
}

.ant-btn-primary {
    background: linear-gradient(90deg, var(--dark-emerald), var(--emerald-green));
    border: none;
    color: var(--white);
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    transition: background 0.3s ease, transform 0.3s ease;
}

.ant-btn-primary:hover {
    background: linear-gradient(90deg, var(--emerald-green), var(--dark-emerald));
    transform: scale(1.05);
}

.footer-text {
    color: #ddd;
    font-size: 0.9rem;
    margin-top: 2rem;
}
Styling and Animations
Floating Animation: The login container has a smooth, floating animation applied via the @keyframes float animation.
Glow Effect: Input fields have an inset glow effect, with color adjustments on focus.
Animated Button: The login button has a gradient background and scales slightly on hover for interactivity.
Troubleshooting
1. Toast Notifications Not Displaying
If toast notifications do not appear, ensure the following:

ToastContainer is present in LoginPage.js.
react-toastify is installed. Run npm install react-toastify if needed.
2. Incorrect Login Alert Instead of Toast
If an alert appears instead of the toast notification, check the handleLogin function to ensure toast.error is used in place of alert.

Conclusion
With this setup, the Login Page Application is ready to use. It provides a secure login method, styled UI, and an enhanced user experience with animations and toast notifications.