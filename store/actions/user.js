import * as firebase from 'firebase';
import { db } from '../../Fire';
export const ADD_PROFILE_PHOTO = 'ADD_PROFILE_PHOTO';
export const FETCH_PROFILE_DATA = 'FETCH_PROFILE_DATA';
export const SET_NEW_USER = 'SET_NEW_USER';
export const SET_NATIVE_LANGUAGE = 'SET_NATIVE_LANGUAGE';
export const SET_TARGET_LANGUAGE = 'SET_TARGET_LANGUAGE';

export const setNewUser = () => {
  return { type: SET_NEW_USER };
};

export const setNativeLanguage = (userId, language) => {
  return async (dispatch) => {
    try {
      const response = await db.collection('userData').doc(userId).set(
        {
          nativeLanguage: language,
        },
        { merge: true }
      );
      console.log(response);
      dispatch({ type: SET_NATIVE_LANGUAGE, nativeLanguage: language });
    } catch (error) {
      console.log(error);
    }
  };
};

export const setTargetLanguage = (userId, language) => {
  return async (dispatch) => {
    try {
      const response = await db.collection('userData').doc(userId).set(
        {
          targetLanguage: language,
        },
        { merge: true }
      );
      console.log(response);
      dispatch({ type: SET_TARGET_LANGUAGE, targetLanguage: language });
    } catch (error) {
      console.log(error);
    }
  };
};

export const addProfilePhoto = (userId, photoUri) => {
  return async (dispatch) => {
    try {
      const response = await fetch(photoUri);
      const blob = await response.blob();
      let ref = firebase.storage().ref().child(`${userId}/images/avatar.jpg`);
      await ref.put(blob);

      dispatch({ type: ADD_PROFILE_PHOTO, photo: photoUri });
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchProfileData = (userId) => {
  return async (dispatch) => {
    try {
      const userData = {};

      let doc = await db.collection('userData').doc(userId).get();
      if (doc.exists) {
        if (doc.data().nativeLanguage) {
          userData.nativeLanguage = doc.data().nativeLanguage;
        }
        if (doc.data().targetLanguage) {
          userData.targetLanguage = doc.data().targetLanguage;
        }
      }

      // console.log('USERDATA: ', userData);

      const foundURL = await firebase
        .storage()
        .ref(`${userId}/images/avatar.jpg`)
        .getDownloadURL();

      if (foundURL) {
        // console.log(foundURL);
        userData.profilePhoto = foundURL;
      }

      dispatch({
        type: FETCH_PROFILE_DATA,
        photo: foundURL,
        userData: userData,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
