import axios from 'axios';

import { SET_POST, SET_LIKE, GET_ERRORS,GET_POSTS,SET_COMMENT } from './types';

// Register User
export const addPost = (postData, history) => dispatch => {
  axios
    .post('/api/posts/create-post', postData)
    .then(res =>
        {
        dispatch({
          type: SET_POST,
          payload: res.data
        })
      }
    )
    .catch(err =>
      dispatch({
        type: SET_POST,
        payload: []
      })
    );
};

export const addLike = (postData, history) => dispatch => {
  axios
    .post('/api/posts/create-like', postData)
    .then(res =>
        dispatch({
          type: SET_LIKE,
          payload: res.data
        })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const addComment = (commentData, history) => dispatch => {
  axios
    .post('/api/comments/create-comment', commentData)
    .then(res =>
        dispatch({
          type: SET_COMMENT,
          payload: res.data
        })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getPosts = () => dispatch => {
  axios
    .get('/api/posts')
    .then(res =>
        dispatch({
          type: GET_POSTS,
          payload: res.data
        })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: []
      })
    );
};
