import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        
            <div>
                <NavLink to="/" exact>Home</NavLink>
                <NavLink to="/profiles" exact>Profiles</NavLink>
                <NavLink to="/login" exact>Login</NavLink>

                <NavLink to="/register" exact>Register</NavLink>
            </div>
        
    )
}

export default Navbar;
