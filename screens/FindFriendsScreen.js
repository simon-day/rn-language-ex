import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  RefreshControl,
} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { db } from '../Fire';
import FindFriendUser from '../components/FindFriendUser';
import calculateDistance from '../utilities/calculateDistance';

const FindFriendsScreen = (props) => {
  const [userList, setUserList] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userId = useSelector((state) => state.auth.userId);
  const userCoords = useSelector((state) => state.user.location);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1500).then(() => setRefreshing(false));
  }, [refreshing]);

  useEffect(() => {
    const getusers = async () => {
      const snapshot = await firebase.firestore().collection('userData').get();

      const list = snapshot.docs
        .map((doc) => {
          const friendCoords = doc.data().location;
          const distanceFromUser = Math.round(
            calculateDistance(userCoords, friendCoords)
          );

          let sharedPhoto;

          if (!doc.data().sharedPhoto) {
            sharedPhoto = require('../assets/placeholderprofilephoto.png');
          } else {
            sharedPhoto = { uri: doc.data().sharedPhoto };
          }

          return {
            ...doc.data(),
            sharedPhoto: sharedPhoto,
            distanceFromUser,
            // username: doc.data().username,
            // location: doc.data().formattedLocation,
            // bio: doc.data().userBio,
            key: doc.id,
          };
        })
        .filter((user) => user.key !== userId);

      setUserList(list);
      setIsFetching(false);
    };

    getusers();
  }, [userCoords, refreshing]);

  return (
    <SafeAreaView style={styles.container}>
      {userList && !isFetching && (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          data={userList}
          renderItem={({ item }) => (
            <FindFriendUser
              navigation={props.navigation}
              userData={item}
              username={item.username}
              distanceFromUser={item.distanceFromUser}
              image={item.sharedPhoto}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export const screenOptions = {
  headerTitle: 'Find Language Exchange Friends',
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
});

export default FindFriendsScreen;
