import { AsyncStorage } from 'react-native';
import env from '../../env';
// export const SIGNUP = 'SIGNUP';
// export const SIGNIN = 'SIGNIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';
export const SET_DISPLAYNAME = 'SET_DISPLAYNAME';

let timer;

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const setDisplayName = (name) => {
  return (dispatch) => {
    dispatch({ type: SET_DISPLAYNAME, displayName: name });
  };
};

export const authenticate = (userId, token, expiryTime, name) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId, token, displayName: name });
  };
};

export const signup = (name, email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${env.googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          displayName: name,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      console.log(errorId);
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000,
        resData.displayName
      )
    );
    // dispatch(setDisplayName(resData.displayName));
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    console.log(resData.displayName);
    saveDataToStorage(
      resData.displayName,
      resData.idToken,
      resData.localId,
      expirationDate
    );
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'email or password is incorrect';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000,
        resData.displayName
      )
    );
    // dispatch(setDisplayName(resData.displayName));
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(
      resData.displayName,
      resData.idToken,
      resData.localId,
      expirationDate
    );
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (displayName, token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      displayName: displayName,
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};