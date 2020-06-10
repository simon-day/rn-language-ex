import React, { useState, useEffect } from 'react';
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

const FetchLocation = (props) => {
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

      // call geocoder API
      const geoResponse = await fetch(
        `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=${location.coords.latitude},${location.coords.longitude},250&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=${env.geoCodeApi}&lang=en-US`
      );
      const resData = await geoResponse.json();
      //   console.log(resData);
      const district =
        resData.Response.View[0].Result[0].Location.Address.District;
      const city = resData.Response.View[0].Result[0].Location.Address.City;
      const county = resData.Response.View[0].Result[0].Location.Address.County;
      console.log(county);
      const country =
        resData.Response.View[0].Result[0].Location.Address.AdditionalData[0]
          .value;

      setFormattedLocation(`${city}, ${country}`);
      console.log(formattedLocation);

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
      //   setUserLocation({ lat: 37.78825, lng: -122.4324 });
      //
    }

    setisFetching(false);
  };

  return (
    <Text>{isFetching ? 'Fetching your location....' : formattedLocation}</Text>
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
