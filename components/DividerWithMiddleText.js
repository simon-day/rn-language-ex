import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DividerWithMiddleText = (props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          marginLeft: 30,
          flex: 1,
          height: StyleSheet.hairlineWidth,
          backgroundColor: 'black',
        }}
      />
      <View>
        <Text style={{ width: 50, textAlign: 'center' }}>{props.text}</Text>
      </View>
      <View
        style={{
          marginRight: 30,
          flex: 1,
          height: StyleSheet.hairlineWidth,
          backgroundColor: 'black',
        }}
      />
    </View>
  );
};

export default DividerWithMiddleText;
