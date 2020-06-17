import {
  LOGOUT,
  SET_DID_TRY_AL,
  SET_DISPLAYNAME,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SIGNOUT_SUCCESS,
  PROFILE_EXISTS,
  SIGN_UP_SUCCESS,
  SET_DATE_OF_BIRTH,
} from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
  username: '',
  dateOfBirth: null,
  didTryAutoLogin: false,
  authError: null,
  profileExists: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_EXISTS:
      return {
        ...state,
        userId: action.userId,
        profileExists: action.exists,
        didTryAutoLogin: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        userId: action.userId,
        profileExists: true,
        didTryAutoLogin: true,
        authError: null,
      };
    case SET_DATE_OF_BIRTH:
      return {
        ...state,
        dateOfBirth: action.dateOfBirth,
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        userId: action.userId,
        profileExists: true,
        didTryAutoLogin: true,
        authError: null,
      };
    case LOGIN_ERROR:
      console.log('Logged in failed');
      return {
        ...state,
        authError: 'Your email and/or password is incorrect',
        didTryAutoLogin: false,
        profileExists: false,
      };
    case SIGNOUT_SUCCESS:
      return {
        ...initialState,
        didTryAutoLogin: true,
        profileExists: false,
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
        profileExists: false,
      };
    default:
      return state;
  }
};
