import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios';

const Login = ({ onLogin, history }) => {
    console.log(history)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    //destructuring
    const { email, password } = formData;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value})

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userLoginInfo = {
            email,
            password
        }

        try {
            const configObj = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accepts': 'application/json'
                }
            }
            const body = JSON.stringify(userLoginInfo);
            const user = await axios.post("http://localhost:5000/api/auth", body, configObj)
            localStorage.token = user.data.token;
            onLogin();
            history.push('/');
            
        } catch (error) {
            console.error(error);
        }

    }

   
        return (
            <Fragment>
                <h1>Login</h1>
                <p className=""><i className="fas fa-user"></i> Login</p>
                <form className="form" onSubmit={(e) => handleSubmit(e)}>
                    <div className="form-fields">
                        <input type="text"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=> handleChange(e)}
                        required
                        />
                    </div>
                    <div className="form-fields">
                        <input type="password"
                        name="password"
                        placehorder="Password"
                        value={password}
                        onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <input className="btn"
                    type="submit"
                    value="login"
                    />
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </form>
               
            </Fragment>
        )
    
}

export default Login