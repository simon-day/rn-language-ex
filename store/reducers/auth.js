import {
  AUTHENTICATE,
  LOGOUT,
  SET_DID_TRY_AL,
  SET_DISPLAYNAME,
  SET_NEW_USER,
  CHECK_ACCOUNT_EXISTS,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
  username: '',
  didTryAutoLogin: false,
  newAccount: true,
  authError: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log('Logged in');
      return {
        ...state,
        authError: null,
      };
    case LOGIN_ERROR:
      console.log('Logged in failed');

      return {
        ...state,
        authError: 'Login Failed',
      };
    case AUTHENTICATE:
      return {
        ...state,
        username: action.displayName,
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
      };
    case CHECK_ACCOUNT_EXISTS:
      return {
        ...state,
      };
    case SET_NEW_USER:
      return {
        ...state,
        newAccount: action.isNew,
      };
    case SET_DISPLAYNAME:
      return {
        ...state,
        username: action.displayName,
      };
    case SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true,
      };
    case LOGOUT:
      return {
        ...initialState,
        didTryAutoLogin: true,
      };
    default:
      return state;
  }
};
