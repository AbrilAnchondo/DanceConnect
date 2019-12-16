import React, { Fragment, Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './components/layout/Home'
import './App.css';

import Login from './components/auth/Login'
import Register from './components/auth/Register'

class App extends Component {
  //const [userID, setUserID] = useState("");
  // const [userName, setUserName] = useState("");
  // const [userEmail, setUserEmail] = useState("");
  state = {
    id: "",
    username: "",
    email: "",
    avatar: ""
  }

  handleLogin = (userInfo) => {
    // console.log(userInfo);
    // setUserName(userInfo.name);
    // setUserEmail(userInfo.email); 
    this.setState({
      id: userInfo.id,
      username: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.avatar
    })
  }

  componentDidMount () {
    fetch("http://localhost:5000/api/auth", {
      headers: {
        "x-auth-token": localStorage.token
      }
    })
    .then(resp => resp.json())
    .then(userInfo => {
      this.handleLogin(userInfo)
    })
  }
 
  render() {
    console.log(this.state)
    return (
      
      <Fragment>
        <Navbar/>
        <Route exact path="/" render={(routerProps)=> <Home {...routerProps}  />} />
          <section className="container">
            <Switch>
              <Route exact path="/register" render={(routerProps)=> <Register {...routerProps} onRegister={this.handleLogin} />} />
              <Route exact path="/login" render={(routerProps)=> <Login {...routerProps} onLogin={this.handleLogin} />} />
              <Route exact path="/profile" />
            </Switch>
        </section>
      </Fragment>
          
    );
  }
}

export default App;
