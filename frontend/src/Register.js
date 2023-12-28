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

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        const success = true;
        event.preventDefault();
        setErrors(validation(values));
        console.log(errors);
    
        if (!errors.username && !errors.email && !errors.password) {
            axios.post('http://localhost:3001/register', values)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
                success = false;
            });
            
        }
        if (success) {
            navigate('/login');
        }
    }
    
    

    return (
        <div className="register-app">
            <div className="register-form">
                <h2>Register</h2>
                <form onSubmit={handleSubmit} method="post">
                    <div className="register-form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" onChange={handleInput} id="username" placeholder="Enter your username" />
                        <span>{errors.username && <span>{errors.username}</span>}</span>
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" onChange={handleInput} id="email" placeholder="Enter your email" />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" onChange={handleInput} id="password" placeholder="Enter your password" />
                    </div>
                    <input type="submit" name="submit"/>
                </form>
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
}

export default Register;