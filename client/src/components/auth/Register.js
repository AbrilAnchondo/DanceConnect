import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
//import axios from 'axios'


const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });

    //destructuring
    const { name, email, password, password2 } = formData;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        //check if passwords match
        if (password !== password2) {
            console.log("Passwords do not match")
        } else {
          const newUser = {
              name,
              email,
              password
          }
    
            try {
                const configObj = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const body = JSON.stringify(newUser);
                const resp = await axios.post('http://localhost:5000/api/users', body, configObj)
                console.log(resp);
                console.log(resp.data);
                
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <Fragment>
            <h1 className="">Sign Up</h1>
            <p className=""><i className="fas fa-user"></i> Create an Account</p>
            <form className="form" onSubmit={(e) => handleSubmit(e)}>
                <div className="form-fields">
                    <input type="text"
                    name="name"
                    placeholder="Name"
                    value={name} 
                    onChange={e => handleChange(e)}
                    required/>
                </div>
                <div className="form-fields">
                    <input type="email"  
                    name="email" 
                    placeholder="Email"
                    value={email}
                    onChange={e => handleChange(e)}
                    required
                    />
                </div>
                <div className="form-fields">
                    <input type="password" 
                    name="password"
                    placeholder="Password"
                    minLength="6"
                    value={password}
                    onChange={e => handleChange(e)} 
                    />
                </div>
                <div className="form-fields">
                    <input type="password" 
                    name="password2" 
                    placeholder="Confirm Password"
                    minLength="6"
                    value={password2}
                    onChange={e => handleChange(e)} 
                    />
                </div>
                <input className="btn" 
                type="submit"
                />
            </form>
            <p>You already have an account? <Link to="/login">Login</Link></p>
        </Fragment>
    )
    
}

export default Register