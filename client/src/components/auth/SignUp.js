import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser,getUsers,emailVerification } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';
import {setCookie, getCookie} from '../../utils/SessionHandler';
import io from 'socket.io-client';
class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      mobile: '',
      user_photo:null,
      errors: {},
      selectedFile: '',
      img_data:'',
      dob:'',
      address:'',
      verification_sent: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
    const socket = io("http://localhost:9000");
    socket.on('USER_LOGIN',(id)=>{
      console.log(id,window.location.pathname);
      if(window.location.pathname === '/register' && id === getCookie('id')){
        window.location.href = '/dashboard';
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if(Object.keys(nextProps.auth.user).length > 0 && !this.state.verification_sent){
      this.props.emailVerification({email: nextProps.auth.user.email, verification_link: "http://localhost:3000/verification"});
      this.setState({verification_sent: true});
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleSelectedFile(e) {
    const reader = new FileReader()
    reader.onload = () => {
      this.state.img_data = reader.result;
    };
    this.setState({
      user_photo: e.target.files[0].name,
      loaded: 0
    });
    reader.readAsDataURL(e.target.files[0]);
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      mobile: this.state.mobile,
      user_photo: this.state.user_photo,
      img_data: this.state.img_data,
      address: this.state.address,
      dob: this.state.dob
    };
    console.log(this.state);
    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors, verification_sent } = this.state;

    return (
      <div className="register">
        <div className="container" hidden={verification_sent}>
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your account for PostFeed
              </p>
              <form encType="multipart/form-data" noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />
                <TextFieldGroup
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Mobile"
                  name="mobile"
                  type="text"
                  value={this.state.mobile}
                  onChange={this.onChange}
                  error={errors.mobile}
                />
                <TextFieldGroup
                  placeholder="Date Of Birth"
                  name="dob"
                  type="text"
                  value={this.state.dob}
                  onChange={this.onChange}
                  error={errors.dob}
                />
                <TextFieldGroup
                  placeholder="Address"
                  name="address"
                  type="text"
                  value={this.state.address}
                  onChange={this.onChange}
                  error={errors.address}
                />
                <TextFieldGroup
                  placeholder="User Photo"
                  name="user_photo"
                  type="file"
                  onChange={this.handleSelectedFile}
                  error={errors.user_photo}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
        <div className="container" hidden={!verification_sent}>
          <h1> A Verification Code has been sent to your email. Please Check your email! </h1>
        </div>
      </div>
    );
  }
}

SignUp.propTypes = {
  registerUser: PropTypes.func.isRequired,
  emailVerification: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser, emailVerification })(withRouter(SignUp));
//export default SignUp;
