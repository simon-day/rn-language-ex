import {
  ADD_PROFILE_PHOTO,
  FETCH_PROFILE_DATA,
  SET_NEW_USER,
  SET_NATIVE_LANGUAGE,
  SET_TARGET_LANGUAGE,
  FETCH_PROFILE_PHOTO,
  SET_GENDER,
  SET_LOCATION,
  SET_FORMATTED_LOCATION,
} from '../actions/user';
import { SET_DATE_OF_BIRTH } from '../actions/auth';
import { LOGOUT } from '../actions/auth';

const initialState = {
  profilePhoto: null,
  nativeLanguage: null,
  targetLanguage: null,
  age: null,
  locaton: null,
  formattedLocation: null,
  gender: null,
  dateOfBirth: null,
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
    case FETCH_PROFILE_PHOTO:
      const photo = action.photoUrl;
      return {
        ...state,
        profilePhoto: photo,
      };
    case FETCH_PROFILE_DATA:
      const userData = action.userData;
      const {
        nativeLanguage,
        targetLanguage,
        gender,
        profilePhoto,
        location,
        dateOfBirth,
      } = userData;

      return {
        ...state,
        gender: gender || null,
        nativeLanguage: nativeLanguage || null,
        targetLanguage: targetLanguage || null,
        profilePhoto: profilePhoto || null,
        location: location || null,
        dateOfBirth: dateOfBirth || null,
      };
    case SET_LOCATION:
      console.log(action.location);
      return {
        ...state,
        location: action.location,
      };
    case SET_FORMATTED_LOCATION:
      return {
        ...state,
        formattedLocation: action.formattedLocation,
      };
    case SET_GENDER:
      return {
        ...state,
        gender: action.gender,
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
