import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { emailVerify } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';
import {getCookie} from '../../utils/SessionHandler';
import io from 'socket.io-client';
class Verification extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      otp:'',
      errors:{}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    const socket = io("http://localhost:9000");
    socket.on('USER_LOGIN',(id)=>{
      if(window.location.pathname === '/verification' && id === getCookie('id')){
        window.location.href = '/dashboard';
      }
    });
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    const verificationData = {
      email: this.state.email,
      otp: this.state.otp
    };

    this.props.emailVerify(verificationData,this.props.history);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  render() {
    const {errors} = this.state;
    return (
      <div className="dashboard">
      <form onSubmit={this.onSubmit}>
          <TextFieldGroup
            placeholder="Enter Email"
            name="email"
            type="text"
            value={this.state.email}
            onChange={this.onChange}
            error={errors.email}
          />
          <TextFieldGroup
            placeholder="Enter OTP"
            name="otp"
            type="password"
            value={this.state.otp}
            onChange={this.onChange}
            error={errors.otp}
          />
          <input type="submit" className="btn btn-info btn-block mt-4" />
        </form>
      </div>
    );
  }
}

Verification.propTypes = {
  emailVerify: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {emailVerify})(
  withRouter(Verification)
);
