import React, { Component } from 'react';

const Navbar = () => {
    return (
        <div>
            <nav>
                <h1>
                    <a href="index.html">DanceConnect</a>
                </h1>
                <ul>
                    <li><a href="profiles.html"></a>Dancers</li>
                    <li><a href="register.html"></a>Register</li>
                    <li><a href="login.html"></a>Login</li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
