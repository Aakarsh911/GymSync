import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import validation from "./LoginValidation";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://52.41.36.82:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { username } = responseData;
        localStorage.setItem("username", username);
        navigate("/");
      } else {
        setErrorMessage("Incorrect email or password");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setErrors(validation(values));
    setFormSubmitted(true); // Set the formSubmitted flag to true
  };

  useEffect(() => {
    // Check if there are no errors whenever errors state is updated and the form has been submitted
    if (Object.keys(errors).length === 0 && formSubmitted) {
      handleSubmit(); // Trigger form submission when there are no errors and the form has been submitted
    }
  }, [errors, formSubmitted]);

  return (
    <div className="register-app">
      <div className="register-form">
        <h2>Login</h2>
        <form onSubmit={handleFormSubmit} method="post">
          <div className="register-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleInput}
              id="email"
              placeholder="Enter your email"
            />
            <span className="error">{errors.email && <span>{errors.email}</span>}</span>
          </div>
          <div className="register-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleInput}
              id="password"
              placeholder="Enter your password"
            />
            <span className="error">{errors.password && <span>{errors.password}</span>}</span>
          </div>
          <input type="submit" name="submit" className="submit" />
          <span className="error">{errorMessage && <span>{errorMessage}</span>}</span>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
