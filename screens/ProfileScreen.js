import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AvatarImage from '../components/AvatarImage';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as userActions from '../store/actions/user';
import * as authActions from '../store/actions/auth';
import env from '../env';
import DateofBirthInput from '../components/DateOfBirthInput';

const ProfileScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [displayAge, setDisplayAge] = useState('');

  const authData = useSelector((state) => state.auth);
  const { userId, username, dateOfBirth: newUserDateOfBirth } = authData;

  const userData = useSelector((state) => state.user);
  const {
    nativeLanguage,
    targetLanguage,
    profilePhoto,
    gender,
    location,
    dateOfBirth,
    formattedLocation,
  } = userData;
  console.log('DATEOFBIRTH FROM USERDATA: ', dateOfBirth);

  var age = dateOfBirth
    ? moment().diff(dateOfBirth, 'years')
    : moment().diff(newUserDateOfBirth, 'years');

  const [isFetching, setisFetching] = useState(false);

  useEffect(() => {
    console.log('in profile useEffect');
    if (profilePhoto) {
      setIsLoading(false);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  }, [profilePhoto]);

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

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
      Permissions.LOCATION
    );

    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions',
        'You need to grant camera permissions and location access to use this app',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const selectFromCameraRollHandler = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    try {
      let image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
        aspect: [4, 3],
      });

      if (!image.cancelled) {
        setIsLoading(true);
        setPhoto({ uri: image.uri });
        dispatch(userActions.addProfilePhoto(userId, image.uri));
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const setCoordsHandler = async () => {
    console.log('FETCHING GPS');
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    try {
      setisFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      console.log(
        'here now location: ',
        location.coords.latitude,
        location.coords.longitude
      );

      dispatch(
        userActions.setLocation(userId, {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        })
      );
    } catch (error) {
      Alert.alert(
        'Could not fetch location!',
        'Please make sure you have GPS enabled or try again later',
        [{ text: 'OK' }]
      );
    }
    setisFetching(false);
  };

  const signOutHandler = () => {
    dispatch(authActions.signOut());
  };

  useEffect(() => {
    console.log('in location useEffect');
    if (!formattedLocation) {
      console.log('NOLOC');
      setCoordsHandler();
    }
  }, []);

  useEffect(() => {
    if (!location || formattedLocation) {
      return;
    }
    ('running this');
    fetchFormattedLocation();
  }, [location]);

  if (isLoading) {
    return (
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <ActivityIndicator
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          size="large"
        />
      </View>
    );
  }

  if (!dateOfBirth) {
    return (
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Text>Enter your date of birth to continue</Text>
        <DateofBirthInput userId={userId} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.avatarImage}>
        {!isLoading ? (
          <AvatarImage
            showAccessory={true}
            source={profilePhoto ? { uri: profilePhoto } : photo}
            onPress={selectFromCameraRollHandler}
          />
        ) : (
          <AvatarImage
            showAccessory={true}
            renderPlaceholderContent={<ActivityIndicator size="small" />}
            onPress={selectFromCameraRollHandler}
          />
        )}
        <Text style={styles.photoText}>
          {username || ''}, {age || ''}
        </Text>
      </View>

      <View style={styles.settingsBody}>
        {/* <View style={styles.settingsBodyRow}>
          <View style={{ marginTop: 20 }}>
            <View style={styles.selectGender}>
              <CheckBox
                center
                title="Male"
                onPress={() => {
                  genderCheckHandler('Male');
                  // setCheckedMale(true);
                  // setCheckedFemale(false);
                }}
                checkedColor="#E9446A"
                checked={gender === 'Male' || false}
                // containerStyle={{
                //   width: '50%',
                //   alignItems: 'center',
                //   textAlign: 'center',
                //   justifyContent: 'center',
                // }}
              />
              <CheckBox
                center
                title="Female"
                onPress={() => {
                  genderCheckHandler('Female');
                }}
                checkedColor="#E9446A"
                checked={gender === 'Female' || false}
              />
            </View>
          </View> */}
        {/* </View> */}

        <View style={styles.settingsBodyRow}>
          <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
            CURRENT LOCATION
          </Text>
          <TouchableOpacity
            style={styles.bioSectionContainer}
            onPress={setCoordsHandler}
          >
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
          </TouchableOpacity>
        </View>

        <View style={styles.settingsBodyRow}>
          <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
            GENDER
          </Text>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('GenderSelect', {
                currentGender: gender || null,
                userId,
              });
            }}
          >
            <View style={styles.bioSectionContainer}>
              <Text style={styles.selfIntroMain}>
                {gender || 'Select your gender'}
              </Text>

              <Ionicons
                style={{ marginRight: 10 }}
                name="ios-create"
                size={25}
                color="#E9446A"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsBodyRow}>
          <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
            I SPEAK
          </Text>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('LanguageSelect', {
                editingNativeLanguage: true,
                nativeLanguage,
                userId,
              });
            }}
          >
            <View style={styles.bioSectionContainer}>
              <Text style={styles.selfIntroMain}>
                {nativeLanguage || 'Select your native language'}
              </Text>

              <Ionicons
                style={{ marginRight: 10 }}
                name="ios-create"
                size={25}
                color="#E9446A"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsBodyRow}>
          <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
            I'M LEARNING
          </Text>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('LanguageSelect', {
                editingTargetLanguage: true,
                targetLanguage: targetLanguage,
                userId,
              });
            }}
          >
            <View style={styles.bioSectionContainer}>
              <Text style={styles.selfIntroMain}>
                {targetLanguage || 'Select language you are learning'}
              </Text>

              <Ionicons
                style={{ marginRight: 10 }}
                name="ios-create"
                size={25}
                color="#E9446A"
              />
            </View>
          </TouchableOpacity>
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
