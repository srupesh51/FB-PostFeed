import { SET_POST,SET_LIKE,GET_POSTS,SET_COMMENT } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  post: {},
  post_like:{},
  post_comment:{},
  post_data: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_POST:
      return {
        ...state,
        post: action.payload
      };
    case SET_LIKE:
      return {
        ...state,
        post_like: action.payload
      };
    case GET_POSTS:
      return {
        ...state,
        post_data: action.payload
      };
    case SET_COMMENT:
      return {
        ...state,
        post_comment: action.payload
      };
    default:
      return state;
  }
}
