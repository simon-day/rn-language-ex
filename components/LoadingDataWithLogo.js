import React from 'react';
import { StyleSheet, Image, View, ActivityIndicator } from 'react-native';

const LoadingDataWithIcon = (props) => {
  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/logo.png')}
        style={{
          marginTop: -245,
          alignSelf: 'center',
          transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
        }}
      />
      <ActivityIndicator size="large" color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default LoadingDataWithIcon;
