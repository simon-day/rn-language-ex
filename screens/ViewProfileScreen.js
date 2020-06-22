import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { db } from '../Fire';
import 'firebase/firestore';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Avatar, Badge } from 'react-native-elements';
import env from '../env';
import LoadingDataWithLogo from '../components/LoadingDataWithLogo';

const ViewProfileScreen = (props) => {
  const { userId, isOnline2, lastSeen2 } = props.route.params;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [displayAge, setDisplayAge] = useState('');
  const [avatarImage, setAvatarImage] = useState(
    require('../assets/placeholderprofilephoto.png')
  );

  const fetchUserDataHandler = async () => {
    setIsLoading(true);
    let userRef = await db.collection('userData').doc(userId).get();
    setUserData({ ...userRef.data() });
    setIsLoading(false);
  };

  const [photo, setPhoto] = useState(
    require('../assets/placeholderprofilephoto.png')
  );

  useEffect(() => {
    fetchUserDataHandler();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarImage}>
          <Avatar
            style={{ width: 150, height: 150 }}
            rounded
            // renderPlaceholderContent={props.renderPlaceholderContent}
            // placeholderStyle={{ backgroundColor: '' }}
            // renderPlaceholderContent={<ActivityIndicator size="small" />}
            showAccessory={false}
            size="xlarge"
            source={
              userData.sharedPhoto
                ? { uri: userData.sharedPhoto }
                : require('../assets/placeholderprofilephoto.png')
            }
          />
          {isOnline2 && (
            <Badge
              status="success"
              badgeStyle={{
                borderColor: '#f2f2f2',
                borderWidth: 4,
                width: 32,
                height: 32,
                borderRadius: 20,
              }}
              containerStyle={{ position: 'absolute', bottom: 60, right: 2 }}
            />
          )}
          <View style={styles.nameAgeHeader}>
            <Text style={styles.usernameText}>{userData.username}</Text>
            <View
              style={{
                marginLeft: 5,
                padding: 3,
                backgroundColor:
                  userData.gender === 'Male' ? '#2CA4D3' : '#B23174',
              }}
            >
              <Text style={styles.ageText}>
                {moment().diff(userData.dateOfBirth, 'years')}
              </Text>
            </View>
          </View>
          <Text
            style={{
              textTransform: 'uppercase',
              fontSize: 10,
              fontWeight: '300',
              marginTop: 5,
            }}
          >
            {lastSeen2 && `Online ${moment(new Date(lastSeen2)).fromNow()}`}
          </Text>
        </View>

        <View style={styles.settingsBody}>
          <View style={{ ...styles.settingsBodyRow }}>
            <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
              ABOUT {userData.username.toUpperCase() || '...'}
            </Text>
            <View style={{ ...styles.bioSectionContainer }}>
              <Text style={styles.selfIntroBioSection}>{userData.userBio}</Text>
            </View>
          </View>

          <View style={styles.settingsBodyRow}>
            <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
              SPEAKS
            </Text>
            <View>
              <View style={styles.bioSectionContainer}>
                <Text style={styles.selfIntroMain}>
                  {userData.nativeLanguage || 'Not Selected'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.settingsBodyRow}>
            <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
              LEARNING
            </Text>
            <View>
              <View style={styles.bioSectionContainer}>
                <Text style={styles.selfIntroMain}>
                  {userData.targetLanguage || 'Not Selected'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.settingsBodyRow}>
            <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
              CURRENT LOCATION
            </Text>
            <View style={styles.bioSectionContainer}>
              <Text style={styles.selfIntroMain}>
                {userData.formattedLocation}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const screenOptions = (navData) => {
  const username = navData.route.params.username;

  return {
    headerTitle: `${username}'s Profile`,
  };
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  nameAgeHeader: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameText: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: '600',
  },
  ageText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  selectGender: {
    flexDirection: 'row',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    marginTop: 230,
    alignItems: 'center',
  },
  settingsBody: {
    marginTop: 0,
    width: '100%',
    height: '100%',
  },

  button: {
    paddingHorizontal: 50,
    backgroundColor: '#E9446A',
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsBodyRow: {
    width: '100%',
  },
  bioSectionHeader: {
    marginLeft: 15,
    marginVertical: 5,
    fontWeight: '600',
  },
  bioSectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#dbdbdb',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  selfIntroMain: {
    color: '#242424',
    fontWeight: '300',
    padding: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selfIntroBioSection: {
    flex: 1,
    marginBottom: 15,
    maxHeight: 400,
    color: '#242424',
    fontWeight: '300',
    padding: 14,
  },
});

export default ViewProfileScreen;
