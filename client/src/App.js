import React, { Fragment, Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './components/layout/Home'
import './App.css';

import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Logout from './components/auth/Logout'

class App extends Component {
  state = {
    id: "",
    username: "",
    email: "",
    avatar: ""
  }

  
  componentDidMount () {
    this.handleLogin();
    
  }

  handleLogin = () => {
    if(localStorage.token) {
      fetch("http://localhost:5000/api/auth", {
        headers: {
          "x-auth-token": localStorage.token
        }
      })
      .then(resp => resp.json())
      .then(userInfo => {
        console.log(userInfo)
        if (!userInfo.errors) {
          this.setState({
            id: userInfo._id,
            username: userInfo.name,
            email: userInfo.email,
            avatar: userInfo.avatar
          })
        }
      })
    }
    
  }

  render() {
    return (
      
      <Fragment>
        <Navbar/>
        <Route exact path="/" render={(routerProps)=> <Home {...routerProps}  />}  />
          <section className="container">

            <Switch>
              <Route exact path="/register" render={(routerProps)=> <Register {...routerProps} onRegister={this.handleLogin} />} />

              <Route exact path="/logout" render={(routerProps)=> <Logout  {...routerProps} username={this.state.username} />} />

              <Route exact path="/login" render={(routerProps)=> <Login {...routerProps} onLogin={this.handleLogin} />} />

              <Route exact path="/profile"/>
            </Switch>

        </section>
      </Fragment>
          
    );
  }
}

export default App;
