import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, ScrollView, View, SafeAreaView, Text } from 'react-native';
import { SearchBar, ListItem, Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import * as userActions from '../store/actions/user';
import { TouchableOpacity } from 'react-native-gesture-handler';

const languages = [
  'English',
  'Spanish',
  'Mandarin',
  'French',
  'German',
  'Italian',
  'Dutch',
  'Cantonese',
  'Japanese',
  'Portugese',
  'Russian',
  'Arabic',
  'Swedish',
  'Korean',
  'Finnish',
  'Greek',
  'Hebrew',
  'Turkish',
  'Vietnamese',
  'Indonesian',
  'Hindi',
  'Afrikaans',
  'Norwegian',
  'Persian',
  'Romanian',
  'Polish',
  'Welsh',
  'Serbian',
  'Punjabi',
];

const NativeLangSelection = (props) => {
  const [searchText, setSearchText] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState(languages);
  const [currentlySelected, setCurrentlySelected] = useState();

  const { nativeLanguage, setNativeLanguage } = props;

  const updateSearch = (search) => {
    setSearchText(search);
    filterLanguagesHandler(search);
  };

  const filterLanguagesHandler = (searchTerm) => {
    const copiedLanguagesList = [...languages];

    setFilteredLanguages(
      copiedLanguagesList.filter((language) => language.includes(searchTerm))
    );
  };

  useEffect(() => {
    setCurrentlySelected(nativeLanguage);
  }, []);

  const handleLanguageChangeHandler = (language) => {
    setCurrentlySelected(language);
  };

  const confirmWithBackButtonhandler = () => {
    setNativeLanguage(currentlySelected);
    props.closeOverlay();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={confirmWithBackButtonhandler}>
          <Text>Back</Text>
        </TouchableOpacity>
        <SearchBar
          platform="ios"
          onChangeText={updateSearch}
          value={searchText}
        />
        <ScrollView>
          {filteredLanguages.map((language, i) => (
            <ListItem
              onPress={() => handleLanguageChangeHandler(language)}
              key={i}
              title={language}
              bottomDivider
              rightIcon={
                currentlySelected === language ? (
                  <Ionicons name="ios-checkmark-circle-outline" size={20} />
                ) : null
              }
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
});

export default NativeLangSelection;
