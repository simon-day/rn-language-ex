import {
  ADD_PROFILE_PHOTO,
  FETCH_PROFILE_DATA,
  SET_NEW_USER,
  SET_NATIVE_LANGUAGE,
  SET_TARGET_LANGUAGE,
} from '../actions/user';
import { LOGOUT } from '../actions/auth';

const initialState = {
  profilePhoto: null,
  nativeLanguage: null,
  targetLanguage: null,
  age: null,
  locaton: null,
  newUser: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case ADD_PROFILE_PHOTO:
      return {
        ...state,
        profilePhoto: action.photo,
      };
    case SET_NEW_USER: {
      return {
        ...state,
        newUser: true,
      };
    }
    case FETCH_PROFILE_DATA:
      const userData = action.userData;

      const { nativeLanguage, targetLanguage } = userData;

      return {
        ...state,
        profilePhoto: userData.profilePhoto,
        nativeLanguage: nativeLanguage ? nativeLanguage : null,
        targetLanguage: targetLanguage ? targetLanguage : null,
      };
    case SET_NATIVE_LANGUAGE:
      return {
        ...state,
        nativeLanguage: action.nativeLanguage,
      };
    case SET_TARGET_LANGUAGE:
      return {
        ...state,
        targetLanguage: action.targetLanguage,
      };
    default:
      return state;
  }
};
