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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as authActions from '../store/actions/auth';
import * as userActions from '../store/actions/user';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import AccountSetupOverlay from '../components/AccountSetupOverlay';
import LanguageSelectionList from '../components/LanguageSelectionList';

const ProfileScreen = (props) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const authData = useSelector((state) => state.auth);
  const { userId, username } = authData;

  const userData = useSelector((state) => state.user);

  const userPhoto = userData.profilePhoto;
  const { nativeLanguage, targetLanguage } = userData;
  const prevImageRef = useRef();

  const [avatar, setAvatar] = useState(null);

  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

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
        await dispatch(userActions.addProfilePhoto(userId, image.uri));
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
    if (prevImageRef.current !== userPhoto) {
      fetchPhoto();

      return;
    }
  }, [userPhoto]);

  const fetchPhoto = useCallback(async () => {
    await dispatch(userActions.fetchProfileData(userId));
    await setAvatar(userPhoto);
    setIsLoading(false);
  }, [userPhoto]);

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
      <View style={{ marginTop: 30 }}>
        {!isLoading && avatar && (
          <Avatar
            onPress={selectFromCameraRollHandler}
            rounded
            placeholderStyle={{ backgroundColor: 'transparent' }}
            showAccessory={!isLoading && avatar && true}
            onAccessoryPress={selectFromCameraRollHandler}
            size="xlarge"
            source={{
              uri: avatar,
            }}
          />
        )}

        {isLoading && (
          <Avatar
            onPress={selectFromCameraRollHandler}
            rounded
            placeholderStyle={{ backgroundColor: '#ccc' }}
            renderPlaceholderContent={
              <ActivityIndicator size="large" color="black" />
            }
            size="xlarge"
          />
        )}
        {!isLoading && !avatar && (
          <Avatar
            onPress={selectFromCameraRollHandler}
            rounded
            placeholderStyle={{ backgroundColor: 'transparent' }}
            showAccessory={!isLoading && avatar && true}
            onAccessoryPress={selectFromCameraRollHandler}
            size="xlarge"
            icon={{ name: 'ios-add', type: 'ionicon', color: 'white' }}
            containerStyle={{ backgroundColor: '#ccc' }}
          />
        )}
      </View>

      {!userPhoto && !isLoading && (
        <Text style={styles.photoText}>Add profile photo</Text>
      )}

      {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View> */}

      <View style={styles.biographyContainer}>
        <Text style={styles.biographyName}>{username}</Text>
        <View style={styles.languageSection}>
          <TouchableOpacity
            style={styles.languageBox}
            onPress={() =>
              props.navigation.navigate('LanguageSelect', {
                nativeLanguage: nativeLanguage,
                targetLanguage: targetLanguage,
                editingNativeLanguage: true,
                userId: userId,
              })
            }
          >
            <View style={styles.languageHeaderContainer}>
              <Text style={styles.languageHeader}>Native Language </Text>
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
                userId: userId,
              })
            }
          >
            <View style={styles.languageHeaderContainer}>
              <Text style={styles.languageHeader}>Target Language </Text>
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
    width: '100%',
  },
  biographyContainer: {
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  biographyName: {
    fontSize: 26,
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
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageHeaderContainer: {
    // flex: 1,
    flexDirection: 'row',
    // alignContent: 'center',
    // alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  languageBox: {
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 10,
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
  languageHeader: {
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 10,
  },
});

export default ProfileScreen;
