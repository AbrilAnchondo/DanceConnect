import React, { Fragment, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './components/layout/Home'
import './App.css';

import Login from './components/auth/Login'
import Register from './components/auth/Register'

const App = () => {
  //const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleLogin = (userInfo) => {
    console.log(userInfo);
    setUserName(userInfo.name);
    setUserEmail(userInfo.email);
    
  }
 

  return (
    
    <Fragment>
      <p>Hello {userName} - {userEmail}</p>
      <Navbar/>
      <Route exact path="/" render={(routerProps)=> <Home {...routerProps}  />} />
        <section className="container">
          <Switch>
            <Route exact path="/register" render={(routerProps)=> <Register {...routerProps} onRegister={handleLogin} />} />
            <Route exact path="/login" render={(routerProps)=> <Login {...routerProps} onLogin={handleLogin} />} />
            <Route exact path="/profile" />
          </Switch>
      </section>
    </Fragment>
        
  );
}

export default App;
