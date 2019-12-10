import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './components/layout/Home'
import './App.css';

import Login from './components/auth/Login'
import Register from './components/auth/Register'

const App = () => {
  return (
    
    <Fragment>
      <Navbar/>
      <Route exact path="/" component={Home} />
        <section className="container">
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" />
          </Switch>
      </section>
    </Fragment>
        
  );
}

export default App;
