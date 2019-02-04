import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts,addLike,addComment} from '../../actions/postActions';
import io from 'socket.io-client';
import Moment from 'react-moment';
import {getCookie} from '../../utils/SessionHandler';
import TextFieldGroup from '../common/TextFieldGroup';
class Dashboard extends Component {
  constructor(){
    super();
    this.state = {
      post_data: [],
      post_data_online: [],
      index: -1,
      text:[],
      tex:"",
      sent_data:false,
      comment:{},
      errors: {},
      socket:null
    }
    this.onChange = this.onChange.bind(this);
  }
  componentWillMount(){
    this.props.getPosts();
  }
  componentDidMount() {
    //this.props.getCurrentProfile();
    const socket = io("http://localhost:9000");
    socket.on('USER_LOGOUT',(id)=>{
      if(!id){
        if(window.location.pathname === '/dashboard'){
          window.location.href = "/";
        }
      }
    });
    socket.on('SEND_LIKE',(postData) => {
      const {post_data} = this.state;
      let postArr = [];
      console.log(postData);
      post_data.map(post =>{
          const postFetch = post;
          if(post._id === postData._id){
            postFetch.like = postData.like;
          }
          console.log(postFetch);
          postArr.push(postFetch);
      });
      console.log(postArr);
      this.setState({post_data: postArr});
    });
    socket.on('SEND_COMMENT',(postData) => {
      const {post_data} = this.state;
      let postArr = [];
      post_data.map(post => {
          const postFetch = post;
          if(post._id === postData._id){
            postFetch.comment = postData.comment;
          }
          postArr.push(postFetch);
      });
      console.log(postArr);
      this.setState({post_data: postArr});
    });
    this.setState({socket:socket});
  }
  onChange(e){
    console.log(e.target.value);
    this.setState({tex: e.target.value});
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
  onDeleteClick(e) {
    //this.props.deleteAccount();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if(nextProps.posts && nextProps.posts.post_like){
      const {socket} = this.state;
      socket.emit('SEND_LIKE', nextProps.posts.post_like);
    }
    if(nextProps.posts && nextProps.posts.post_comment){
      const {socket} = this.state;
      socket.emit('SEND_COMMENT', nextProps.posts.post_comment);
    }
    this.setState({post_data: nextProps.posts && nextProps.posts.post_data.length > 0 ? nextProps.posts.post_data : []});
  }
  render() {
    const {post_data, errors, socket, post_data_online} = this.state;
    if(socket){
    socket.on('SEND_POST',(postData) => {
        const postDataFilter = post_data.filter(post => {return post._id === postData._id});
        if(postDataFilter.length === 0){
          let pData = post_data;
          pData.unshift(postData);
          console.log(pData);
          this.setState({post_data_online: pData});
       }
    });
   }
    const postData = post_data_online.length > 0 ? post_data_online: post_data;
    return (
        postData.length > 0 ? (<div className="dashboard">
          <div className="container">
          <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Post Description</th>
                    <th>Post Image</th>
                    <th> Date Created </th>
                    <th> Add Like </th>
                    <th> Likes </th>
                    <th> Add Comment </th>
                    <th> Comments </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    postData.map((post,i)=> {
                        return(
                          <tr
                            key={post._id} >
                        <td> {post.desc}</td>
                        <td> <img
                            className="rounded-circle"
                            src={post.image_url}
                            alt={post.desc}
                            style={{ width: '25px', marginRight: '5px' }}
                            title="You must have a image linked to every Post Feed"
                          /> </td>
                          <td> <Moment format="HH:mm">{post.date}</Moment> </td>
                          <td> <button type="button" className="btn btn-primary"
                          onClick={()=>{
                            if(post.user._id !== getCookie('id')){
                                this.props.addLike({"post_id":post._id,"like":!post.like || post.like === 0 ? "1" : (post.like+1).toString()});
                            } else {
                              alert("Sorry you cannot like your own post!");
                            }
                          }}>Add Like</button> </td>
                          <td> {!post.like || post.like === 0 ? 0 : post.like} </td>
                          <td> <div key={post._id}>
                          <TextFieldGroup
                            placeholder="Enter Comment"
                            name="text"
                            value={this.state.text[i]}
                            onChange={this.onChange}
                            error={errors.text}
                          /> </div> <button type="button" className="btn btn-secondary"
                          onClick={()=>{
                              this.props.addComment({"post_id":post._id, "text":this.state.tex});
                          }}>Add Comment</button> </td>
                          <td> {
                            post.comment.map((comment,i)=> {
                              return(
                                <ul className="list-group-item" style={{ listStyleType: "none" }}>
                                <li> <img
                                    className="rounded-circle"
                                    src={post.user.image_url}
                                    alt={post.user.name}
                                    style={{ width: '25px', marginRight: '5px' }}
                                    title="You have Commented"
                                  /> </li>
                                  <li>{comment.text}</li>
                                  <li><Moment format="HH:mm">{comment.date}</Moment> </li>
                                </ul>
                              )
                            })
                          }
                         </td>
                      </tr>
                        )
                    })
                  }
                </tbody>
              </table>
          </div>
        </div> ) : <h1> Sorry No posts found! </h1>
    );
  }
}

Dashboard.propTypes = {
  addLike: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired,
  post_data: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  posts: state.posts,
  post_data: state.post_data,
  errors: state.errors
});

export default connect(mapStateToProps, {getPosts,addLike,addComment})(
  Dashboard
);
