import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Avatar, Overlay } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
  Alert,
  AsyncStorage,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as authActions from '../store/actions/auth';
import * as userActions from '../store/actions/user';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = (props) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState();

  const authData = useSelector((state) => state.auth);
  const { username } = authData;

  const userData = useSelector((state) => state.user);
  const { nativeLanguage, targetLanguage, profilePhoto } = userData;

  const prevImageRef = useRef();

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
        setIsLoading(true);
        await dispatch(userActions.addProfilePhoto(id, image.uri));
        prevImageRef.current = image.uri;
        await setAvatar(image.uri);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const getId = async () => {
      const userData = await AsyncStorage.getItem('userData');
      const transformedData = JSON.parse(userData);
      const { userId } = transformedData;
      setId(userId);

      if (userId) {
        setIsLoading(true);
        console.log('RUNNINGHERE');
        dispatch(userActions.fetchProfileData(userId));
        setIsLoading(false);
      }
    };

    getId();
  }, [dispatch]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   dispatch(userActions.fetchProfileData(id));
  //   setIsLoading(false);
  // }, [userId]);

  // const fetchPhoto = useCallback(async () => {
  //   await dispatch(userActions.fetchProfileData(id));
  //   await setAvatar(profilePhoto);
  //   setIsLoading(false);
  // }, [profilePhoto]);

  const signOutHandler = () => {
    dispatch(authActions.logout());
  };

  LayoutAnimation.easeInEaseOut();

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <ActivityIndicator size="large" color="black" />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.profileTopRow}>
        <View>
          {profilePhoto && !isLoading && (
            <Avatar
              style={{ width: 150, height: 150 }}
              onPress={selectFromCameraRollHandler}
              rounded
              placeholderStyle={{ backgroundColor: 'transparent' }}
              showAccessory={!isLoading && profilePhoto && true}
              onAccessoryPress={selectFromCameraRollHandler}
              size="xlarge"
              source={{
                uri: profilePhoto,
              }}
            />
          )}
          {isLoading && (
            <Avatar
              style={{ width: 150, height: 150 }}
              onPress={selectFromCameraRollHandler}
              rounded
              placeholderStyle={{ backgroundColor: '#ccc' }}
              renderPlaceholderContent={
                <ActivityIndicator size="large" color="black" />
              }
              size="xlarge"
            />
          )}
          {!isLoading && !profilePhoto && (
            <Avatar
              style={{ width: 150, height: 150 }}
              onPress={selectFromCameraRollHandler}
              rounded
              placeholderStyle={{ backgroundColor: 'transparent' }}
              showAccessory={true}
              onAccessoryPress={selectFromCameraRollHandler}
              size="xlarge"
              source={require('../assets/placeholderprofilephoto.png')}
              // icon={{ name: 'ios-add', type: 'ionicon', color: 'white' }}
              containerStyle={{ backgroundColor: '#ccc' }}
            />
          )}
          {!profilePhoto && !isLoading && (
            <Text style={styles.photoText}>Add profile photo</Text>
          )}
          <View style={styles.biographyHeader}>
            <FontAwesome
              style={{
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: 'white',
                backgroundColor: '#eb2661',
                color: 'white',
              }}
              name="female"
              size={22}
            />
            <Text style={styles.biographyText}>
              {username} <Text style={styles.ageText}>28</Text>
            </Text>
          </View>
        </View>
        <View style={styles.languagesContainer}>
          <View style={styles.languageSection}>
            <TouchableOpacity
              style={styles.languageBox}
              onPress={() =>
                props.navigation.navigate('LanguageSelect', {
                  nativeLanguage: nativeLanguage,
                  targetLanguage: targetLanguage,
                  editingNativeLanguage: true,
                  userId: id,
                })
              }
            >
              <View style={styles.languageTitleAndIcon}>
                <Text style={styles.languageHeaderText}>Native Language </Text>
                <Ionicons
                  style={{ paddingLeft: 10 }}
                  name="ios-build"
                  size={15}
                />
              </View>
              {nativeLanguage ? (
                <Text style={{ fontWeight: '200' }}>{nativeLanguage}</Text>
              ) : (
                <ActivityIndicator size="small" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.languageBox}
              onPress={() =>
                props.navigation.navigate('LanguageSelect', {
                  targetLanguage: targetLanguage,
                  nativeLanguage: nativeLanguage,
                  editingTargetLanguage: true,
                  userId: id,
                })
              }
            >
              <View style={styles.languageTitleAndIcon}>
                <Text style={styles.languageHeaderText}>Target Language </Text>
                <Ionicons
                  style={{ paddingLeft: 10 }}
                  name="ios-build"
                  size={15}
                />
              </View>
              {targetLanguage ? (
                <Text style={{ fontWeight: '200' }}>{targetLanguage}</Text>
              ) : (
                <ActivityIndicator size="small" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.selfIntroduction}>
        <Text style={styles.bioSectionHeader}>ABOUT ME</Text>
        <View style={styles.bioSectionContainer}>
          <Text style={styles.selfIntroMain}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat,
            quod sunt. Quibusdam vel voluptate officia quas numquam ut minus
            dolores.
          </Text>
        </View>
      </View>

      <View style={styles.selfIntroduction}>
        <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
          LIVING IN
        </Text>
        <View style={styles.bioSectionContainer}>
          <Text style={styles.selfIntroMain}>London, UK</Text>
        </View>
      </View>

      <TouchableOpacity style={{ marginTop: 32 }} onPress={signOutHandler}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileTopRow: {
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 225,
  },
  languagesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  biographyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  biographyText: {
    fontSize: 26,
    paddingVertical: 5,
    fontWeight: '700',
    textAlign: 'center',
  },
  ageText: {
    fontSize: 20,
    fontWeight: '300',
  },
  avatarPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#E1E2E6',
    borderRadius: 100,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  photoText: {
    marginTop: 5,
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '200',
  },
  languageSection: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageTitleAndIcon: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  languageBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 10,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderRadius: 15,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  languageHeaderText: {
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 7,
  },
  selfIntroduction: {
    width: '100%',
  },
  bioSectionHeader: {
    marginLeft: 15,
    marginVertical: 5,
    fontWeight: '600',
  },
  bioSectionContainer: {
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
