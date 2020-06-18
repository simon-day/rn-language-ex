import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import * as userActions from '../store/actions/user';

const AboutMeTextInput = (props) => {
  const { userBio } = props;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [aboutMeText, setAboutMeText] = useState('');

  const textChangeHandler = (text) => {
    if (text.trim().length === 0) {
      setAboutMeText('');
      return;
    }

    setAboutMeText(text);
  };

  useEffect(() => {
    if (userBio !== null) {
      setAboutMeText(userBio);
    }
  }, [userBio]);

  const setAboutMeHandler = () => {
    setIsLoading(true);
    dispatch(userActions.setUserBio(props.userId, aboutMeText));
    setIsLoading(false);
  };

  return (
    <View style={{ width: '100%', flex: 1 }}>
      <TextInput
        editable={!isLoading}
        // scrollEnabled={false}
        textAlignVertical="top"
        style={{
          fontWeight: '300',
          width: '95%',
          maxHeight: 80,
          marginHorizontal: 15,
          marginVertical: 10,
        }}
        spellCheck={true}
        numberOfLines={4}
        maxHeight={60}
        multiline={true} //allows for paragraphs to be entered by user
        maxLength={200} //This is the guy you want to look at!!!!!
        placeholder="Tell your language partners a bit about yourself..."
        value={aboutMeText}
        onChangeText={textChangeHandler}
        onEndEditing={setAboutMeHandler}
        // caretHidden={true}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          alignContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: '100',
            margin: 5,
          }}
        >
          {aboutMeText.length}/200
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AboutMeTextInput;
