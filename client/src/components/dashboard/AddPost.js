import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {getCookie} from '../../utils/SessionHandler';
import { addPost} from '../../actions/postActions';
import TextFieldGroup from '../common/TextFieldGroup';
import io from 'socket.io-client';
class AddPost extends Component {
  constructor(){
    super();
    this.state = {
      desc:'',
      image:'',
      _id:'',
      img_data:'',
      errors: {},
      socket: null
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
  }
  componentWillMount(){
    console.log("Hello");
  }
  componentDidMount() {
    //this.props.getCurrentProfile();
    const socket = io("http://localhost:9000");
    socket.on('USER_LOGOUT',(id)=>{
      if(!id){
        if(window.location.pathname === '/add-post'){
          window.location.href = "/";
        }
      }
    });
    this.setState({socket: socket});
  }

  onDeleteClick(e) {
    //this.props.deleteAccount();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    console.log(nextProps);
    if(nextProps.posts.post){
      this.state.socket.emit('SEND_POST',nextProps.posts.post);
      window.location.href = '/dashboard';
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
      image: e.target.files[0].name,
      loaded: 0
    });
    reader.readAsDataURL(e.target.files[0]);
  }

  onSubmit(e) {
    e.preventDefault();

    const newPostData = {
      desc: this.state.desc,
      _id: getCookie('id'),
      image: this.state.image,
      img_data: this.state.img_data
    };
    this.props.addPost(newPostData, this.props.history);
  }
  render() {
    const { errors } = this.state;

    return (
      <div className="add-post">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <form encType="multipart/form-data" noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Enter Post Description"
                  name="desc"
                  value={this.state.desc}
                  onChange={this.onChange}
                  error={errors.desc}
                />
                <TextFieldGroup
                  placeholder="Enter Image to Post"
                  name="image"
                  type="file"
                  onChange={this.handleSelectedFile}
                  info="Your image for postfeed will be displayed on dashboard"
                  error={errors.image}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddPost.propTypes = {
  addPost: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  posts: state.posts,
  post: state.post,
  errors: state.errors
});

export default connect(mapStateToProps, {addPost})(
  AddPost
);
