import {
  AUTHENTICATE,
  LOGOUT,
  SET_DID_TRY_AL,
  SET_DISPLAYNAME,
} from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
  username: '',
  didTryAutoLogin: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        username: action.displayName,
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
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
