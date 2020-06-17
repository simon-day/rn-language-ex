import * as firebase from 'firebase';
import { db } from '../../Fire';
import env from '../../env';
export const ADD_PROFILE_PHOTO = 'ADD_PROFILE_PHOTO';
export const FETCH_PROFILE_DATA = 'FETCH_PROFILE_DATA';
export const FETCH_PROFILE_PHOTO = 'FETCH_PROFILE_PHOTO';
export const SET_NEW_USER = 'SET_NEW_USER';
export const SET_NATIVE_LANGUAGE = 'SET_NATIVE_LANGUAGE';
export const SET_TARGET_LANGUAGE = 'SET_TARGET_LANGUAGE';
export const SET_GENDER = 'SET_GENDER';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_DATE_OF_BIRTH = 'SET_DATE_OF_BIRTH';
export const SET_USER_BIO = 'SET_USER_BIO';
export const SET_FORMATTED_LOCATION = 'SET_FORMATTED_LOCATION';
import * as Location from 'expo-location';

export const setNewUser = () => {
  return { type: SET_NEW_USER };
};

export const setDateOfBirth = (userId, dateOfBirth) => {
  return async (dispatch) => {
    try {
      await db.collection('userData').doc(userId).set(
        {
          dateOfBirth: dateOfBirth,
        },
        { merge: true }
      );
      dispatch({ type: SET_DATE_OF_BIRTH, dateOfBirth: dateOfBirth });
    } catch (error) {
      console.log(error);
    }
  };
};

export const setLocation = (userId, coords) => {
  return async (dispatch) => {
    let lat;
    let lng;

    if (coords === null) {
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      lat = location.coords.latitude;
      lng = location.coords.longitude;
    } else {
      lat = coords.lat;
      lng = coords.lng;
    }
    // go to API to format then set both at same time
    const geoResponse = await fetch(
      `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=${lat},${lng},250&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=${env.geoCodeApi}&lang=en-US`
    );
    const resData = await geoResponse.json();
    const city = resData.Response.View[0].Result[0].Location.Address.City;
    const country =
      resData.Response.View[0].Result[0].Location.Address.AdditionalData[0]
        .value;

    try {
      await db
        .collection('userData')
        .doc(userId)
        .set(
          {
            location: { lat, lng },
            formattedLocation: `${city}, ${country}`,
          },
          { merge: true }
        );
      dispatch({ type: SET_LOCATION, location: coords });
    } catch (error) {
      console.log(error);
    }
  };
};

export const setFormattedLocation = (loc) => {
  return { type: SET_FORMATTED_LOCATION, formattedLocation: loc };
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

export const setUserBio = (userId, userBio) => {
  return async (dispatch) => {
    try {
      await db.collection('userData').doc(userId).set(
        {
          userBio,
        },
        { merge: true }
      );
      dispatch({ type: SET_USER_BIO, userBio });
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

export const fetchProfileData = (userId) => {
  return async (dispatch) => {
    let userData;
    let doc = await db.collection('userData').doc(userId).get();

    if (doc.exists) {
      userData = doc.data();
    }

    try {
      const newUrl = await firebase
        .storage()
        .ref(`${userId}/images/avatar.jpg`)
        .getDownloadURL();

      if (newUrl) {
        let profilePhoto = newUrl;
        dispatch({
          type: FETCH_PROFILE_PHOTO,
          photoUrl: profilePhoto,
        });
      }
      dispatch({
        type: FETCH_PROFILE_DATA,
        userData: userData,
      });
    } catch (error) {
      dispatch({
        type: FETCH_PROFILE_DATA,
        userData: userData,
      });
    }
  };
};
