import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {getCookie} from './utils/SessionHandler';
import { setCurrentUser, logoutUser } from './actions/authActions';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import Verification from './components/verification/Verification';
import Login from './components/auth/Login';
import PrivateRoute from './components/common/PrivateRoute';
import store from './store';
import AddPost from './components/dashboard/AddPost';
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = '/';
  }
}
console.log("App",getCookie('id'));
class App extends Component {
  componentDidMount(){

  }
  render() {
    return (
      <Provider store={store} >
        <Router>
          <div className="App">
              <Navbar />
              <Route exact path="/" component={Landing} />
              <div className="container">
                <Route exact path="/register" component={SignUp} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/verification" component={Verification} />
                <Switch>
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/add-post" component={AddPost} />
                </Switch>
              </div>
              <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
