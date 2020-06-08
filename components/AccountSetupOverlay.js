import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import LanguageSelectionScreen from './LanguageSelectionList';

const AccountSetupOverlay = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View>
      <Button title="Open Overlay" onPress={toggleOverlay} />

      <Overlay
        overlayStyle={styles.overlay}
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        {/* <Text>Hello from Overlay!</Text> */}
        <LanguageSelectionScreen />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  overlay: {
    width: '75%',
    height: '75%',
  },
});

export default AccountSetupOverlay;
