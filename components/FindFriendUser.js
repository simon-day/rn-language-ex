import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Avatar, Badge, Icon } from 'react-native-elements';
import * as firebase from 'firebase';

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

  useEffect(() => {
    let onlineStatus = firebase.database().ref('status/' + key + '/state');
    onlineStatus.on('value', function (snapshot) {
      if (snapshot.val() === 'online') {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
      //   updateStarCount(postElement, snapshot.val());
    });

    return () => onlineStatus;
  }, []);

  return (
    <View style={styles.row}>
      <View style={styles.avatarContainer}>
        <Avatar size="large" rounded source={props.image} />
        {isOnline && (
          <Badge
            status="success"
            badgeStyle={{ width: 20, height: 20, borderRadius: 20 }}
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
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Ionicons
          style={{ color: 'grey' }}
          size={26}
          name="ios-arrow-dropright"
          onPress={() =>
            props.navigation.navigate('ViewProfile', { userId: key })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
    marginVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  avatarContainer: {},
  avatarImage: {
    width: 80,
    height: 80,
  },
  userInfoContainer: {
    // backgroundColor: 'red',
    flex: 1,
    padding: 10,
    marginLeft: 10,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nameAgeHeader: {
    flexDirection: 'row',
  },
  ageText: {
    color: 'white',
    fontSize: 13,
  },
  locationText: {
    paddingTop: 5,
  },
  distanceText: {
    paddingTop: 7,
  },
});

export default FindFriendUser;
