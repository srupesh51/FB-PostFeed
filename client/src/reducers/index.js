import { combineReducers } from 'redux';
import authReducer from './authReducer';
import postReducer from './postReducer';
import errorReducer from './errorReducer';
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  posts: postReducer
});
