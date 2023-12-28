import {Link} from "react-router-dom";
import {useState} from "react";
import validation from "./LoginValidation";

function Login() {
    console.log("there");
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(validation(values));
    }

    return (
        <div className="register-app">
            <div className="register-form">
                <h2>Login</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className="register-form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" onChange={handleInput} id="email" placeholder="Enter your email" />
                        <span>{errors.email && <span>{errors.email}</span>}</span>
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" onChange={handleInput} id="password" placeholder="Enter your password" />
                        <span>{errors.password && <span>{errors.password}</span>}</span>
                    </div>
                    <button type="submit">Login</button>
                </form>
                Don't have an account? <Link to="/register">Register</Link>
            </div>
        </div>
    );
}

export default Login;