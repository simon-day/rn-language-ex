import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { db } from '../Fire';
import calculateDistance from '../utilities/calculateDistance';

const FindFriendsScreen = (props) => {
  const [userList, setUserList] = useState();
  const [isFetching, setIsFetching] = useState(true);

  const userId = useSelector((state) => state.auth.userId);
  const userCoords = useSelector((state) => state.user.location);

  useEffect(() => {
    const getusers = async () => {
      const snapshot = await firebase.firestore().collection('userData').get();

      const list = snapshot.docs
        .map((doc) => {
          console.log('doc.data(): ', doc.data());
          const friendCoords = doc.data().location;

          const distanceFromUser = Math.round(
            calculateDistance(userCoords, friendCoords)
          );

          return {
            username: doc.data().username,
            location: doc.data().formattedLocation,
            bio: doc.data().userBio,
            key: doc.id,
            sharedPhoto: doc.data().sharedPhoto || null,
            distanceFromUser,
          };
        })
        .filter((user) => user.key !== userId);

      console.log(list);
      setUserList(list);
      console.log('USERLIST: ', userList);
      setIsFetching(false);
    };

    getusers();
  }, [userCoords]);

  return (
    <SafeAreaView style={styles.container}>
      {userList && !isFetching && (
        <FlatList
          data={userList}
          renderItem={({ item }) => (
            <View>
              <Text>{item.username}</Text>
              {item.sharedPhoto && (
                <Image
                  style={{ width: 200, height: '100%' }}
                  source={{ uri: item.sharedPhoto }}
                />
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FindFriendsScreen;
