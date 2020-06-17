import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import DateOfBirthInput from '../components/DateOfBirthInput';
import LoadingDataWithLogo from '../components/LoadingDataWithLogo';

const AskForAge = () => {
  const userId = useSelector((state) => state.auth.userId);
  const username = useSelector((state) => state.auth.username);
  const userData = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData.profilePhoto !== null) {
      setIsLoading(false);
    }
  }, [userData]);

  if (isLoading) {
    return <LoadingDataWithLogo />;
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: -40,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '400' }}>
          Enter your date of birth to continue
        </Text>
        <DateOfBirthInput userId={userId} />
      </View>
    );
  }
};

const styles = StyleSheet.create({});

export default AskForAge;
