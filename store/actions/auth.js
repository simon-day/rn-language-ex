import { AsyncStorage } from 'react-native';
import env from '../../env';

// export const SIGNUP = 'SIGNUP';
// export const SIGNIN = 'SIGNIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';
export const SET_DISPLAYNAME = 'SET_DISPLAYNAME';
export const SET_NEW_USER = 'SET_NEW_USER';
export const CHECK_ACCOUNT_EXISTS = 'CHECK_ACCOUNT_EXISTS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const SIGNOUT_SUCCESS = 'SIGNOUT_SUCCESS';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const PROFILE_EXISTS = 'PROFILE_EXISTS';
export const SET_DATE_OF_BIRTH = 'SET_DATE_OF_BIRTH ';
import * as firebase from 'firebase';
import { db } from '../../Fire';
import { fetchProfileData } from './user';

export const profileExists = (YorN, userId = null, displayName = null) => {
  return async (dispatch) => {
    if (userId !== null) {
      dispatch(fetchProfileData(userId));
    }

    dispatch({
      type: PROFILE_EXISTS,
      exists: YorN,
      userId: userId,
      displayName,
    });
  };
};

export const googleSignIn = () => {
  return async (dispatch) => {
    const provider = new firebase.auth.GoogleAuthProvider();

    await firebase.auth().signInWithRedirect(provider);
    const response = firebase.auth().getRedirectResult();
    console.log(response);
  };
};

export const signIn = (email, password) => {
  return (dispatch) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        dispatch({ type: LOGIN_SUCCESS, userId: res.user.uid });
      })
      .catch((err) => {
        console.log('here');
        dispatch({ type: LOGIN_ERROR, err });
      });
  };
};

export const signOut = () => {
  return (dispatch) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: SIGNOUT_SUCCESS });
      });
  };
};

export const setNewUser = (isNew) => {
  return { type: SET_NEW_USER, isNew };
};

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const setDisplayName = (name) => {
  return (dispatch) => {
    dispatch({ type: SET_DISPLAYNAME, displayName: name });
  };
};

export const signUp = (name, email, password, dateOfBirth) => {
  return async (dispatch) => {
    try {
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      // console.log('UMMM: ', response);
      await firebase.auth().currentUser.updateProfile({
        displayName: name,
      });

      dispatch(setDisplayName(name));
      await db.collection('userData').doc(response.user.uid).set(
        {
          dateOfBirth: dateOfBirth,
        },
        { merge: true }
      );
      console.log('hmm');
      dispatch({
        type: SET_DATE_OF_BIRTH,
        dateOfBirth,
      });

      dispatch({ type: SIGN_UP_SUCCESS, userId: response.user.uid });
      // dispatch DOB setup
      // dispatch(setDateOfBirth(dateOfBirth, response.user.uid));
    } catch (error) {
      console.log(error);
    }
  };
};
