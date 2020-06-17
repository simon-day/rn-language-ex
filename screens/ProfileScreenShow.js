import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import AvatarImage from '../components/AvatarImage';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as userActions from '../store/actions/user';
import * as authActions from '../store/actions/auth';
import env from '../env';
import LoadingDataWithLogo from '../components/LoadingDataWithLogo';
import AboutMeTextInput from '../components/AboutMeTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ProfileScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  // const [isFetching, setisFetching] = useState(false);
  const [displayAge, setDisplayAge] = useState('');

  const [avatarImage, setAvatarImage] = useState(
    require('../assets/placeholderprofilephoto.png')
  );

  const authData = useSelector((state) => state.auth);
  const { userId, username, dateOfBirth: newUserDateOfBirth } = authData;
  console.log(username);

  const userData = useSelector((state) => state.user);
  const {
    nativeLanguage,
    targetLanguage,
    profilePhoto,
    gender,
    location,
    dateOfBirth,
    formattedLocation,
    userBio,
  } = userData;

  var age = dateOfBirth
    ? moment().diff(dateOfBirth, 'years')
    : moment().diff(newUserDateOfBirth, 'years');

  const fetchFormattedLocation = async () => {
    const geoResponse = await fetch(
      `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=${location.lat},${location.lng},250&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=${env.geoCodeApi}&lang=en-US`
    );
    const resData = await geoResponse.json();
    const city = resData.Response.View[0].Result[0].Location.Address.City;
    const country =
      resData.Response.View[0].Result[0].Location.Address.AdditionalData[0]
        .value;

    dispatch(userActions.setFormattedLocation(`${city}, ${country}`));
  };

  const [photo, setPhoto] = useState(
    require('../assets/placeholderprofilephoto.png')
  );

  const signOutHandler = () => {
    dispatch(authActions.signOut());
  };

  if (isLoading && !formattedLocation) {
    return <LoadingDataWithLogo />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.avatarImage}>
        <AvatarImage />

        <Text style={styles.photoText}>
          {username || ''}, {age || ''}
        </Text>
      </View>

      <View style={styles.settingsBody}>
        <View style={styles.settingsBodyRow}>
          <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
            I SPEAK
          </Text>
          <View>
            <View style={styles.bioSectionContainer}>
              <Text style={styles.selfIntroMain}>
                {nativeLanguage || 'Select your native language'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsBodyRow}>
          <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
            I'M LEARNING
          </Text>
          <View>
            <View style={styles.bioSectionContainer}>
              <Text style={styles.selfIntroMain}>
                {targetLanguage || 'Select language you are learning'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ ...styles.settingsBodyRow }}>
          <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
            ABOUT ME
          </Text>

          <View style={styles.bioSectionContainer}>
            <Text>{userBio}</Text>
          </View>
        </View>

        <View style={styles.settingsBodyRow}>
          <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
            GENDER
          </Text>
          <View>
            <View style={styles.bioSectionContainer}>
              <Text style={styles.selfIntroMain}>
                {gender || 'Select your gender'}
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
              {formattedLocation || 'Here'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>UPDATE</Text>
              <Ionicons
                style={{ marginHorizontal: 10 }}
                name="ios-refresh"
                size={25}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={{ marginTop: 32 }} onPress={signOutHandler}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
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
  photoText: {
    marginTop: 10,
    fontSize: 26,
    textAlign: 'center',
    fontWeight: '600',
  },
  greeting: {
    // marginTop: 32,
    color: '#2e2e2e',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
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
});

export default ProfileScreen;
