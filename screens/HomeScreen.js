import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { Overlay } from 'react-native-elements';
import * as authActions from '../store/actions/auth';

const HomeScreen = (props) => {
  const userName = useSelector((state) => state.auth.username);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const signOutHandler = () => {
    dispatch(authActions.logout());
  };

  LayoutAnimation.easeInEaseOut();

  // useEffect(() => {
  //   console.log(userName);
  // }, [auth]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi {userName}</Text>

      <TouchableOpacity style={{ marginTop: 32 }} onPress={signOutHandler}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
