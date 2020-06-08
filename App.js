import React, { useState } from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import authReducer from './store/reducers/auth';
import userReducer from './store/reducers/user';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as firebase from 'firebase';
import FirebaseKeys from './config';

import { decode, encode } from 'base-64';
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

// firebase.initializeApp(FirebaseKeys);

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
