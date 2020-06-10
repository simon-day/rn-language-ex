import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  AsyncStorage,
} from 'react-native';
import { CheckBox, Overlay } from 'react-native-elements';
import AvatarImage from '../components/AvatarImage';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import NativeLangSelection from '../components/NativeLangSelection';
import FetchLocation from '../components/FetchLocation';
import TargetLangSelection from '../components/TargetLangSelection';
import * as userActions from '../store/actions/user';
import * as authActions from '../store/actions/auth';
import * as Location from 'expo-location';
import * as firebase from 'firebase';
// import * as Permissions from 'expo-permissions';

const ProfileScreen2 = (props) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const authData = useSelector((state) => state.auth);
  const { userId } = authData;

  const userData = useSelector((state) => state.user);
  const { nativeLanguage, targetLanguage, profilePhoto, gender } = userData;

  const [updatePhoto, setUpdatePhoto] = useState(false);

  console.log('gender: ', gender);

  useEffect(() => {
    setIsLoading(true);
    dispatch(userActions.fetchProfileData(userId));
    setIsLoading(false);
  }, []);

  const genderCheckHandler = (selectedGender) => {
    if (selectedGender === 'Male') {
      dispatch(userActions.setGender(userId, 'Male'));
    } else if (selectedGender === 'Female') {
      dispatch(userActions.setGender(userId, 'Female'));
    }
  };

  const [photo, setPhoto] = useState(
    require('../assets/placeholderprofilephoto.png')
  );

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions',
        'You need to grant camera permissions to use this app',
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
        setUpdatePhoto(true);
        setIsLoading(true);
        setPhoto({ uri: image.uri });
        await dispatch(userActions.addProfilePhoto(userId, image.uri));
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const signOutHandler = () => {
    dispatch(authActions.logout());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.avatarImage}>
        <AvatarImage
          showAccessory={true}
          source={!isLoading && profilePhoto ? { uri: profilePhoto } : photo}
          onPress={selectFromCameraRollHandler}
        />
        {/* <Text style={styles.photoText}>Add profile photo</Text> */}
      </View>

      <View style={styles.settingsBody}>
        <View style={styles.settingsBodyRow}>
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
                checked={gender === 'Male'}
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
                checked={gender === 'Female'}
              />
            </View>
          </View>
        </View>

        <View style={styles.settingsBodyRow}>
          <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
            LIVING IN
          </Text>
          <View style={styles.bioSectionContainer}>
            {/* <Text style={styles.selfIntroMain}>
              {setInitialCoordsHandler()}
            </Text> */}
            <FetchLocation />
            <Ionicons style={{ marginRight: 10 }} name="ios-create" size={25} />
          </View>
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
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    marginTop: 200,
  },
  photoText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '200',
  },
  greeting: {
    // marginTop: 32,
    color: '#2e2e2e',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  settingsBody: {
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

export default ProfileScreen2;
