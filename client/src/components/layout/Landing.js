import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import {getCookie} from '../../utils/SessionHandler';
import io from 'socket.io-client';
class Landing extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    const socket = io("http://localhost:9000");
    socket.on('USER_LOGIN',(id)=>{
      console.log(id,window.location.pathname);
      if(window.location.pathname === '/' && id === getCookie('id')){
        window.location.href = '/dashboard';
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    console.log(nextProps);
  }
  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">ToDoListCreator</h1>
                <p className="lead">
                  {' '}
                  Create a Awesome todo list, share it with your friends
                </p>
                <hr />
                <Link to="/register" className="btn btn-lg btn-info mr-2">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-lg btn-light">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
