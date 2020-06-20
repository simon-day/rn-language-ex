import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Avatar, Badge, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

const FindFriendUser = (props) => {
  const {
    username,
    distanceFromUser,
    dateOfBirth,
    location,
    key,
    formattedLocation,
    gender,
  } = props.userData;
  const age = moment().diff(dateOfBirth, 'years');

  let distanceAway;

  if (distanceFromUser < 2) {
    distanceAway = 'less than 2';
  } else {
    distanceAway = distanceFromUser;
  }

  const [isOnline, setIsOnline] = useState();
  const [lastSeen, setLastSeen] = useState();

  useEffect(() => {
    let onlineStatus = firebase.database().ref('status/' + key + '/state');
    let lastChanged = firebase
      .database()
      .ref('status/' + key + '/last_changed');
    onlineStatus.on('value', function (snapshot) {
      if (snapshot.val() === 'online') {
        setLastSeen(null);
        setIsOnline(true);
      } else {
        lastChanged.on('value', (snapshot) => {
          console.log(snapshot.val());
          if (snapshot.val() === null) {
            return;
          }
          setLastSeen(moment(new Date(snapshot.val())));
        });
        setIsOnline(false);
      }
      //   } else if (snapshot.val().state === 'offline') {
      //     // let lastChanged = firebase.database().ref('status/' + key + '/last_changed');
      //     setIsOnline(false);
      //   }
      //   updateStarCount(postElement, snapshot.val());
    });

    return () => onlineStatus;
  }, []);

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() =>
        props.navigation.navigate('ViewProfile', { userId: key, username })
      }
    >
      <View style={styles.avatarContainer}>
        <Avatar size="medium" rounded source={props.image} />
        {isOnline && (
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
        {lastSeen && (
          <Text
            style={{ textTransform: 'uppercase', fontSize: 9, marginTop: 6 }}
          >
            Last seen {lastSeen.fromNow()}
          </Text>
        )}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Ionicons
          style={{ color: 'grey' }}
          size={26}
          name="ios-arrow-dropright"
          onPress={() =>
            props.navigation.navigate('ViewProfile', {
              userId: key,
              username: username,
            })
          }
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 6,
    marginVertical: 3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
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

export default FindFriendUser;
