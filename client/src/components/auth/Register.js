import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'


const Register = () => {
    
    return (
        <Fragment>
            <h1 className="">Sign Up</h1>
            <p className=""><i className="fas fa-user"></i> Create an Account</p>
            <form className="form">
                <div className="form-fields">
                    <input type="text"
                    name="name"
                    placeholder="Name" 
                    required/>
                </div>
                <div className="form-fields">
                    <input type="email"  
                    name="email" 
                    placeholder="Email" 
                    />
                </div>
                <div className="form-fields">
                    <input type="password" 
                    name="password"
                    placeholder="Password"
                    minLength="6" 
                    />
                </div>
                <div className="form-fields">
                    <input type="password" 
                    name="password2" 
                    placeholder="Confirm Password"
                    minLength="6" 
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