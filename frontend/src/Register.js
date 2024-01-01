import { Link } from "react-router-dom";
import validation from "./RegisterValidation";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
                if (response.ok) {
                    localStorage.setItem('username', values.username);
                    navigate("/");
                }
                if (response.status === 409) {
                    setErrorMessage('Email already exists. Please login.');
                }
            } catch (err) {
                console.log(err);
                console.log(err.response);
                if (err.response && err.response.data) {
                    setErrorMessage(err.response.data.error);
                }
            } finally {
                setSubmitting(false);
            }
        } else {
            setSubmitting(false);
        }
    };

    return (
        <div className="register-app">
            <div className="register-form">
                <h2>Register</h2>
                <form onSubmit={handleSubmit} method="post">
                    <div className="register-form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" onChange={handleInput} id="username" placeholder="Enter your username" />
                        <span className="error">{errors.username && <span>{errors.username}</span>}</span>
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" onChange={handleInput} id="email" placeholder="Enter your email" />
                        <span className="error">{errors.email && <span>{errors.email}</span>}</span>
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" onChange={handleInput} id="password" placeholder="Enter your password" />
                        <span className="error">{errors.password && <span>{errors.password}</span>}</span>
                    </div>
                    <input type="submit" name="submit" className="submit" />
                    <span className="error">{errorMessage && <span>{errorMessage}</span>}</span>
                </form>
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
}

export default Register;