import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
} from 'react-native';
import { CheckBox, Overlay } from 'react-native-elements';
import AvatarImage from '../components/AvatarImage';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import NativeLangSelection from '../components/NativeLangSelection';
import TargetLangSelection from '../components/TargetLangSelection';

const AccountSetUpScreen = (props) => {
  const userId = useSelector((state) => state.auth.userId);

  const [checkedMale, setCheckedMale] = useState(false);
  const [checkedFemale, setCheckedFemale] = useState(false);
  const [nativeLanguage, setNativeLanguage] = useState(
    'Select your native language...'
  );
  const [editingNativeLanguage, setEditingNativeLanguage] = useState(false);

  const [targetLanguage, setTargetLanguage] = useState(
    'Select your target language...'
  );
  const [editingTargetLanguage, setEditingTargetLanguage] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(
    require('../assets/placeholderprofilephoto.png')
  );
  const [overLayOneVisible, setOverlayOneVisible] = useState(false);
  const [overLayTwoVisible, setOverlayTwoVisible] = useState(false);

  const toggleOverlayOne = () => {
    setOverlayOneVisible(!overLayOneVisible);
  };

  const toggleOverlayTwo = () => {
    setOverlayTwoVisible(!overLayTwoVisible);
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
        setProfilePhoto({ uri: image.uri });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={{ marginTop: 25, textAlign: 'center' }}>
        Let your potential language exchange partners know a little about you
      </Text>
      <View style={styles.avatarImage}>
        <AvatarImage
          showAccessory={true}
          source={profilePhoto}
          onPress={selectFromCameraRollHandler}
        />
        <Text style={styles.photoText}>Add profile photo</Text>
      </View>

      <View style={styles.settingsBody}>
        <View style={styles.settingsBodyRow}>
          <View style={{ marginTop: 20 }}>
            <View style={styles.selectGender}>
              <CheckBox
                center
                title="Male"
                onPress={() => {
                  setCheckedMale(true);
                  setCheckedFemale(false);
                }}
                checkedColor="#E9446A"
                checked={checkedMale}
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
                  setCheckedFemale(true);
                  setCheckedMale(false);
                }}
                checkedColor="#E9446A"
                checked={checkedFemale}
                // containerStyle={{ width: '50%' }}
              />
            </View>
          </View>
        </View>

        <View style={styles.settingsBodyRow}>
          <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
            LIVING IN
          </Text>
          <View style={styles.bioSectionContainer}>
            <Text style={styles.selfIntroMain}>Set your location...</Text>
            <Ionicons style={{ marginRight: 10 }} name="ios-create" size={25} />
          </View>
        </View>

        <View style={styles.settingsBodyRow}>
          <Text style={{ ...styles.bioSectionHeader, marginTop: 12 }}>
            I SPEAK
          </Text>
          <TouchableOpacity
            onPress={() => {
              setOverlayOneVisible(!overLayOneVisible);
            }}
          >
            <View style={styles.bioSectionContainer}>
              <Overlay
                animationType="slide"
                fullScreen
                isVisible={overLayOneVisible}
                onBackdropPress={toggleOverlayOne}
              >
                <NativeLangSelection
                  nativeLanguage={nativeLanguage}
                  closeOverlay={toggleOverlayOne}
                  setNativeLanguage={setNativeLanguage}
                />
              </Overlay>
              <Text style={styles.selfIntroMain}>{nativeLanguage}</Text>

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
              toggleOverlayTwo();
            }}
          >
            <View style={styles.bioSectionContainer}>
              <Overlay
                fullScreen
                isVisible={overLayTwoVisible}
                onBackdropPress={toggleOverlayTwo}
              >
                <TargetLangSelection
                  targetLanguage={targetLanguage}
                  closeOverlay={toggleOverlayTwo}
                  setTargetLanguage={setTargetLanguage}
                />
              </Overlay>
              <Text style={styles.selfIntroMain}>{targetLanguage}</Text>

              <Ionicons
                style={{ marginRight: 10 }}
                name="ios-create"
                size={25}
              />
            </View>
          </TouchableOpacity>
        </View>
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
    marginTop: 150,
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
  //   back: {
  //     position: 'absolute',
  //     top: 40,
  //     left: 32,
  //     width: 36,
  //     height: 36,
  //     borderRadius: 16,
  //     backgroundColor: '#E1E2E6',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },

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

export default AccountSetUpScreen;
