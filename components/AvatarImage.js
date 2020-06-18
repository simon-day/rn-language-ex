import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as userActions from '../store/actions/user';
import * as Linking from 'expo-linking';

const AvatarImage = (props) => {
  const dispatch = useDispatch();

  const [avatarImage, setAvatarImage] = useState();

  const [photo, setPhoto] = useState(
    require('../assets/placeholderprofilephoto.png')
  );

  const userData = useSelector((state) => state.user);
  const { profilePhoto } = userData;

  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (profilePhoto) {
      setPhotoHandler();
    }
  }, [profilePhoto]);

  const setPhotoHandler = useCallback(() => {
    setAvatarImage({ uri: profilePhoto });
  }, [avatarImage, profilePhoto]);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (result.status !== 'granted') {
      Alert.alert(
        'Allow Permission to your camera roll',
        'You need to grant camera permissions to add or change your profile photo',
        [
          { text: 'OK' },
          {
            text: 'Go to App Settings',
            onPress: () => Linking.openURL('app-settings:'),
          },
        ]
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
        // setIsLoading(true);
        setPhoto({ uri: image.uri });
        setAvatarImage({ uri: image.uri });
        dispatch(userActions.addProfilePhoto(userId, image.uri));
      }
    } catch (error) {
      console.log(error);
    }
    // setIsLoading(false);
  };

  return (
    <Avatar
      style={{ width: 150, height: 150 }}
      onPress={selectFromCameraRollHandler}
      rounded
      // renderPlaceholderContent={props.renderPlaceholderContent}
      placeholderStyle={{ backgroundColor: 'transparent' }}
      renderPlaceholderContent={<ActivityIndicator size="small" />}
      showAccessory={props.showAccessory}
      onAccessoryPress={selectFromCameraRollHandler}
      size="xlarge"
      source={avatarImage || require('../assets/placeholderprofilephoto.png')}
    />
  );
};

const styles = StyleSheet.create({});

export default AvatarImage;
