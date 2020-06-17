import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import * as userActions from '../store/actions/user';
import { TextInputMask } from 'react-native-masked-text';

const DateOfBirthInput = (props) => {
  const dispatch = useDispatch();
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const setDateOfBirthHandler = () => {
    let dateFormat = 'DD/MM/YYYY';
    let formattedDate = moment(dateOfBirth.toString(), dateFormat);
    let years = moment().diff(formattedDate, 'years', false);
    if (years < 16) {
      setErrorMessage('You must be 16 years and above to use this app');
      return;
    }

    const DOB = new Date(formattedDate).getTime();

    dispatch(userActions.setDateOfBirth(props.userId, DOB));
  };

  const dateValidator = (text) => {
    let inputArr = text.split('');

    // if (inputArr.length === 0) {
    //   setDateOfBirth('');
    // }

    if (inputArr.length > 0 && !inputArr[0].match(/[0-3]/)) {
      return;
    }

    if (
      inputArr.length > 1 &&
      inputArr[0].match(/3/) &&
      inputArr[1].match(/[2-9]/)
    ) {
      return;
    }

    if (inputArr.length > 3 && !inputArr[3].match(/[0-1]/)) {
      return;
    }

    if (inputArr.length > 4 && !inputArr[4].match(/[0-9]/)) {
      return;
    }

    if (inputArr.length > 6 && !inputArr[6].match(/[1-2]/)) {
      return;
    }

    if (inputArr.length > 7 && !inputArr[7].match(/[0]|[9]/)) {
      return;
    }

    if (text.length === 10) {
      let dateFormat = 'DD/MM/YYYY';

      let correctFormatDate = moment(text.toString(), dateFormat);

      if (!moment(correctFormatDate).isValid()) {
        setErrorMessage('Invalid date');
        setDateOfBirth('');

        return;
      }
    }

    setDateOfBirth(text);
  };

  return (
    <>
      <View style={{ marginTop: 32 }}>
        <TextInputMask
          autoFocus
          style={styles.input}
          placeholder="DD/MM/YYYY"
          type={'datetime'}
          options={{
            format: 'DD/MM/YYYY',
          }}
          value={dateOfBirth}
          onChangeText={(text) => {
            dateValidator(text);
          }}
          returnKeyType="done"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={setDateOfBirthHandler}>
        <Text style={{ color: '#FFF', fontWeight: '500', fontSize: 20 }}>
          Save
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    paddingHorizontal: 60,
    fontSize: 20,
    backgroundColor: '#E9446A',
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 24,
  },
});

export default DateOfBirthInput;
