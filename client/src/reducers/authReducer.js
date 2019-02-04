import isEmpty from '../validation/is-empty';

import { SET_CURRENT_USER,SET_USER,SET_EMAIL_VERIFICATION,SET_EMAIL_VERIFY } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  user: {},
  user_confirm: {},
  user_verification:{}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case SET_EMAIL_VERIFICATION:
      return {
        ...state,
        user_verification: action.payload
      };
    case SET_EMAIL_VERIFY:
      return {
        ...state,
        user_confirm: action.payload
      };
    default:
      return state;
  }
}
