import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  Button,
  View,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { db } from '../Fire';
import FindFriendUser from '../components/FindFriendUser';
import calculateDistance from '../utilities/calculateDistance';

const FindFriendsScreen = (props) => {
  const [userList, setUserList] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const [sortBy, setSortBy] = useState('distance');
  const [refreshing, setRefreshing] = useState(false);
  const [userStatusChange, setUserStatusChange] = useState(false);

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

  useFocusEffect(
    React.useCallback(() => {
      const getusers = async () => {
        const snapshot = await firebase
          .firestore()
          .collection('userData')
          .get();

        let list = snapshot.docs
          .map((doc) => {
            const friendCoords = doc.data().location;
            const distanceFromUser = Math.round(
              calculateDistance(userCoords, friendCoords)
            );

            let sharedPhoto;
            let isOnline;
            let lastSeen;

            let onlineStatus = firebase
              .database()
              .ref('status/' + doc.id + '/state');
            let lastChanged = firebase
              .database()
              .ref('status/' + doc.id + '/last_changed');
            onlineStatus.on('value', function (snapshot) {
              if (snapshot.val() && snapshot.val() === 'online') {
                isOnline = true;
              } else if (snapshot.val() && snapshot.val() === 'offline') {
                lastChanged.on('value', (snapshot) => {
                  lastSeen = snapshot.val();
                  isOnline = false;
                });
              } else {
                isOnline = false;
                lastSeen = null;
              }
            });

            if (!doc.data().sharedPhoto) {
              sharedPhoto = require('../assets/placeholderprofilephoto.png');
            } else {
              sharedPhoto = { uri: doc.data().sharedPhoto };
            }

            return {
              ...doc.data(),
              sharedPhoto: sharedPhoto,
              distanceFromUser,
              key: doc.id,
              isOnline,
              lastSeen,
            };
          })
          .filter((user) => user.key !== userId);

        if (sortBy === 'lastOnline') {
          list = list.sort((a, b) => {
            if (a.isOnline && !b.isOnline) {
              return -1;
            }
            if (!a.isOnline && b.isOnline) {
              return 1;
            }
            if (a.lastSeen > b.lastSeen) {
              return -1;
            }
            if (a.lastSeen < b.lastSeen) {
              return 1;
            }
          });
        }
        if (sortBy === 'distance') {
          list = list.sort((a, b) => a.distanceFromUser - b.distanceFromUser);
        }

        setUserList(list);
        setIsFetching(false);
      };

      getusers();

      return () => {
        console.log('CLEANUP');

        firebase
          .database()
          .ref('status/' + userId + '/state')
          .off();
        firebase
          .database()
          .ref('status/' + userId + '/last_changed')
          .off();
      };
    }, [refreshing, sortBy])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          title="sort by last seen"
          onPress={() => setSortBy('lastOnline')}
        >
          <View
            style={{
              // height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRightWidth: StyleSheet.hairlineWidth,
              paddingHorizontal: 20,
              borderColor: '#ccc',
            }}
          >
            <Ionicons
              name="ios-eye"
              size={23}
              color={sortBy === 'lastOnline' ? '#E9446A' : 'black'}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: sortBy === 'lastOnline' ? '600' : '300',
                color: sortBy === 'lastOnline' ? '#E9446A' : 'black',
              }}
            >
              {' '}
              SORT BY LAST SEEN
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          title="sort by last seen"
          onPress={() => setSortBy('distance')}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Ionicons
              name="ios-pin"
              size={23}
              color={sortBy === 'distance' ? '#E9446A' : 'black'}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: sortBy === 'distance' ? '600' : '300',
                color: sortBy === 'distance' ? '#E9446A' : 'black',
              }}
            >
              {' '}
              SORT BY DISTANCE
            </Text>
          </View>
        </TouchableOpacity>
      </View>

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
    marginHorizontal: 20,
  },
  buttonsContainer: {
    // flex: 1,
    height: 40,
    // backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 10,
  },
});

export default FindFriendsScreen;
