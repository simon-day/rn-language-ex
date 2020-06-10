import * as firebase from 'firebase';
import { db } from '../../Fire';
export const ADD_PROFILE_PHOTO = 'ADD_PROFILE_PHOTO';
export const FETCH_PROFILE_DATA = 'FETCH_PROFILE_DATA';
export const FETCH_PROFILE_PHOTO = 'FETCH_PROFILE_PHOTO';
export const SET_NEW_USER = 'SET_NEW_USER';
export const SET_NATIVE_LANGUAGE = 'SET_NATIVE_LANGUAGE';
export const SET_TARGET_LANGUAGE = 'SET_TARGET_LANGUAGE';
export const SET_GENDER = 'SET_GENDER';
export const SET_LOCATION = 'SET_LOCATION';

export const setNewUser = () => {
  return { type: SET_NEW_USER };
};

export const setLocation = (userId, coords) => {
  return async (dispatch) => {
    try {
      await db.collection('userData').doc(userId).set(
        {
          location: coords,
        },
        { merge: true }
      );
      dispatch({ type: SET_LOCATION, location: coords });
    } catch (error) {
      console.log(error);
    }
  };
};

export const setGender = (userId, gender) => {
  return async (dispatch) => {
    try {
      await db.collection('userData').doc(userId).set(
        {
          gender: gender,
        },
        { merge: true }
      );
      dispatch({ type: SET_GENDER, gender: gender });
    } catch (error) {
      console.log(error);
    }
  };
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

// export const fetchProfilePhoto = (userId) => {
//   return async (dispatch) => {
//     const userData = {};

//     try {
//       const newUrl = await firebase
//         .storage()
//         .ref(`${userId}/images/avatar.jpg`)
//         .getDownloadURL();
//       console.log(newUrl);
//       // const imageUrl = await firebase
//       //   .storage()
//       //   .ref(`${userId}/images/avatar.jpg`)
//       //   .getDownloadURL();
//       dispatch({ type: FETCH_PROFILE_PHOTO, photoUrl: newUrl });
//     } catch (error) {
//       console.log('ERE');
//       dispatch({
//         type: FETCH_PROFILE_PHOTO,
//         photoUrl: null,
//       });
//     }
//   };
// };

export const fetchProfileData = (userId) => {
  return async (dispatch) => {
    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     console.log('ere');
    //     dispatch(fetchProfilePhoto(user.uid));
    //   }
    // });
    const userData = {};

    let doc = await db.collection('userData').doc(userId).get();
    if (doc.exists) {
      if (doc.data().nativeLanguage) {
        userData.nativeLanguage = doc.data().nativeLanguage;
      }
      if (doc.data().targetLanguage) {
        userData.targetLanguage = doc.data().targetLanguage;
      }
      if (doc.data().gender) {
        userData.gender = doc.data().gender;
      }
      if (doc.data().location) {
        userData.location = doc.data().location;
      }
    }

    const newUrl = await firebase
      .storage()
      .ref(`${userId}/images/avatar.jpg`)
      .getDownloadURL();

    if (newUrl) {
      userData.profilePhoto = newUrl;
    }

    // dispatch(fetchProfilePhoto(userId));
    dispatch({
      type: FETCH_PROFILE_DATA,
      userData: userData,
    });
  };
};
