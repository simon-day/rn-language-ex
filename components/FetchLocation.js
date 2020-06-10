import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import env from '../env';
import * as userActions from '../store/actions/user';

const FetchLocation = (props) => {
  const dispatch = useDispatch();
  console.log('FetchLocationCalled');
  const [userLocation, setUserLocation] = useState();
  const [isFetching, setisFetching] = useState(false);
  const [formattedLocation, setFormattedLocation] = useState('');

  useEffect(() => {
    setCoordsHandler();
  }, []);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions',
        'You need to grant location permissions to use this app',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const setCoordsHandler = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      setUserLocation('You must allow Exchange to access your location');
      return;
    }

    try {
      setisFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });

      dispatch(
        userActions.setLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        })
      );
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert(
        'Could not fetch location!',
        'Please make sure you have GPS enabled or try again later',
        [{ text: 'OK' }]
      );
    }

    setisFetching(false);
  };

  return (
    <Text
      style={{
        color: '#242424',
        fontWeight: '300',
        padding: 14,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {isFetching ? 'Fetching your location....' : formattedLocation}
    </Text>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15,
    alignItems: 'center',
  },
  mapPreview: {
    marginBottom: 10,
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default FetchLocation;
