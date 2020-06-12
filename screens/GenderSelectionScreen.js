import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, View, Button } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import * as userActions from '../store/actions/user';

const genders = ['Male', 'Female'];

const LanguageSelectionScreen = (props) => {
  const dispatch = useDispatch();
  const [currentlySelected, setCurrentlySelected] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { currentGender, userId } = props.route.params;

  console.log('currentlySelecred: ', currentlySelected);

  useEffect(() => {
    setCurrentlySelected(currentGender);
  }, []);

  const handleGenderChangeHandler = async (gender) => {
    setCurrentlySelected(gender);
    setIsLoading(true);
    dispatch(userActions.setGender(userId, gender));
    setIsLoading(false);
  };

  return (
    <>
      <View style={styles.container}>
        {genders.map((gender, i) => (
          <ListItem
            disabled={isLoading}
            onPress={() => handleGenderChangeHandler(gender)}
            key={i}
            title={gender}
            // style={ ? styles.topListItem}
            topDivider
            bottomDivider={gender === 'Female'}
            rightIcon={
              currentlySelected === gender ? (
                <Ionicons
                  name="ios-checkmark-circle-outline"
                  size={20}
                  color="#E9446A"
                />
              ) : null
            }
          />
        ))}
      </View>
    </>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: 'I Am',
    headerLeft: null,
    headerRight: () => (
      <Button
        onPress={() => navData.navigation.goBack()}
        title="Done"
        color="#E9446A"
      />
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default LanguageSelectionScreen;
