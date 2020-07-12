import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Avatar, Badge, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import 'firebase/firestore';

const ChatPreview = (props) => {
  const {
    username,
    sharedPhoto,
    userId: friendId,
    dateOfBirth,
    formattedLocation,
    gender,
  } = props.userData;
  const { distanceFromUser, chatRoomId } = props;
  const age = moment().diff(dateOfBirth, 'years');

  const ownId = useSelector((state) => state.auth.userId);
  const ownUsername = useSelector((state) => state.user.username);

  let distanceAway;

  if (distanceFromUser < 2) {
    distanceAway = 'less than 2';
  } else {
    distanceAway = distanceFromUser;
  }

  const [isOnline2, setIsOnline2] = useState();
  const [lastSeen2, setLastSeen2] = useState();

  const createChatRoomId = () => {
    return [ownId, friendId].sort((a, b) => a < b).join('');
  };

  useEffect(() => {
    let onlineStatus = firebase.database().ref('status/' + friendId + '/state');
    let lastChanged = firebase
      .database()
      .ref('status/' + friendId + '/last_changed');
    onlineStatus.on('value', function (snapshot) {
      if (snapshot.val() === 'online') {
        setLastSeen2(null);
        setIsOnline2(true);
      } else {
        lastChanged.on('value', (snapshot) => {
          if (snapshot.val() === null) {
            return;
          }
          setLastSeen2(snapshot.val());
        });
        setIsOnline2(false);
      }
    });

    return () => {
      onlineStatus.off();
      lastChanged.off();
    };
  }, []);

  return (
    <TouchableWithoutFeedback
      style={styles.row}
      onPress={() => {
        props.navigation.navigate('PrivateChat', {
          chatRoomId: createChatRoomId(),
          ownUsername,
          friendUsername: username,
          ownId,
        });
      }}
    >
      <View style={styles.row}>
        <View>
          <Avatar
            size="medium"
            rounded
            source={
              sharedPhoto
                ? { uri: sharedPhoto }
                : require('../assets/placeholderprofilephoto.png')
            }
          />
          {isOnline2 && (
            <Badge
              status="success"
              badgeStyle={{ width: 12, height: 12, borderRadius: 20 }}
              containerStyle={{ position: 'absolute', bottom: 2, right: 2 }}
            />
          )}
        </View>
        <View style={styles.userInfoContainer}>
          <View style={styles.nameAgeHeader}>
            <Text style={styles.usernameText}>{username}</Text>
            <View
              style={{
                marginLeft: 5,
                padding: 2,
                backgroundColor: gender === 'Male' ? '#2CA4D3' : '#B23174',
              }}
            >
              <Text style={styles.ageText}>{age}</Text>
            </View>
          </View>
          <Text style={styles.locationText}>{formattedLocation}</Text>
          <Text style={styles.distanceText}>{distanceAway}km away</Text>
          {lastSeen2 && (
            <Text
              style={{ textTransform: 'uppercase', fontSize: 9, marginTop: 6 }}
            >
              Last seen {moment(new Date(lastSeen2)).fromNow()}
            </Text>
          )}
        </View>
      </View>
      {/* <View style={{ flexDirection: 'row' }}></View> */}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 6,
    // marginVertical: 3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    backgroundColor: '#F2F2F2',
  },
  avatarContainer: {},
  avatarImage: {
    width: 90,
    height: 90,
  },
  userInfoContainer: {
    // backgroundColor: 'red',
    flex: 1,
    padding: 10,
    marginLeft: 10,
  },
  usernameText: {
    fontSize: 15,
    fontWeight: '500',
  },
  nameAgeHeader: {
    flexDirection: 'row',
  },
  ageText: {
    color: 'white',
    fontSize: 12,
  },
  locationText: {
    paddingTop: 4,
    fontSize: 12,
  },
  distanceText: {
    marginTop: 3,
    fontWeight: '300',
    fontSize: 11,
  },
});

export default ChatPreview;
