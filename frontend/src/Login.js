import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import validation from "./LoginValidation";

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors(validation(values));
    
        // Check if there are no errors
        if (Object.keys(errors).length === 0) {
            try {
                const response = await fetch('http://localhost:3001/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    navigate("/");
                } else {
                    console.error('Authentication failed');
                }
            } catch (error) {
                console.error('Error during authentication:', error);
            }
        }
    };
    

    return (
        <div className="register-app">
            <div className="register-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} method="post">
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
                    <button type="submit">Login</button>
                </form>
                Don't have an account? <Link to="/register">Register</Link>
            </div>
        </div>
    );
}

export default Login;