import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-elements';

const AvatarImage = (props) => {
  return (
    <Avatar
      style={{ width: 150, height: 150 }}
      onPress={props.onPress}
      rounded
      // renderPlaceholderContent={props.renderPlaceholderContent}
      placeholderStyle={{ backgroundColor: 'transparent' }}
      renderPlaceholderContent={props.renderPlaceholderContent}
      showAccessory={!props.renderPlaceholderContent && props.showAccessory}
      onAccessoryPress={props.onPress}
      size="xlarge"
      source={props.source}
    />
  );
};

const styles = StyleSheet.create({});

export default AvatarImage;
