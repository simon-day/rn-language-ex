import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const MessageScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>MessageScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MessageScreen;
