import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {setCookie} from '../utils/SessionHandler';
import { GET_ERRORS, SET_CURRENT_USER, SET_EMAIL_VERIFICATION, SET_EMAIL_VERIFY, SET_USER } from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/create-user', userData)
    .then(res =>
      dispatch({
        type: SET_USER,
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

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login-user', userData)
    .then(res => {
      // Save to localStorage
      const { token, id } = res.data;
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      
      setCookie('id',id);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const emailVerification = (userData, history) => dispatch => {
  axios
    .post('/api/users/verification-email', userData)
    .then(res =>
      dispatch({
        type: SET_EMAIL_VERIFICATION,
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

export const emailVerify = (userData, history) => dispatch => {
  axios
    .post('/api/users/confirm-verification', userData)
    .then(res =>
      {
      history.push('/login')
      dispatch({
        type: SET_EMAIL_VERIFY,
        payload: res.data
      })
     }
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
