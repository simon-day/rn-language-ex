import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, ScrollView } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import * as userActions from '../store/actions/user';

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

const LanguageSelectionScreen = (props) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState(languages);
  const [currentlySelected, setCurrentlySelected] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const {
    targetLanguage,
    nativeLanguage,
    editingNativeLanguage,
    editingTargetLanguage,
    userId,
  } = props.route.params;

  const updateSearch = (search) => {
    setSearchText(search);
    filterLanguagesHandler(search);
  };

  const filterLanguagesHandler = (searchTerm) => {
    const copiedLanguagesList = [...languages];

    setFilteredLanguages(
      copiedLanguagesList.filter((language) => language.includes(searchTerm))
    );
    // console.log(copiedLanguagesList);
  };

  useEffect(() => {
    setCurrentlySelected(
      editingTargetLanguage ? targetLanguage : nativeLanguage
    );
  }, []);

  const handleLanguageChangeHandler = async (language) => {
    setCurrentlySelected(language);
    setIsLoading(true);
    if (editingNativeLanguage) {
      await dispatch(userActions.setNativeLanguage(userId, language));
      setIsLoading(false);
    }
    if (editingTargetLanguage) {
      await dispatch(userActions.setTargetLanguage(userId, language));
      setIsLoading(false);
    }
  };

  return (
    <>
      <SearchBar
        platform="ios"
        onChangeText={updateSearch}
        value={searchText}
      />
      <ScrollView>
        {filteredLanguages.map((language, i) => (
          <ListItem
            disabled={isLoading}
            onPress={() => handleLanguageChangeHandler(language)}
            key={i}
            title={language}
            //   subtitle={l.subtitle}
            bottomDivider
            rightIcon={
              currentlySelected === language ? (
                <Ionicons name="ios-checkmark-circle-outline" size={20} />
              ) : null
            }
          />
        ))}
      </ScrollView>
    </>
  );
};

export const screenOptions = (navData) => {
  let headerTitle;

  if (navData.route.params.editingNativeLanguage) {
    headerTitle = 'Select Native Language';
  } else {
    headerTitle = 'Select Learning Language';
  }

  return {
    headerTitle: headerTitle,
  };
};

const styles = StyleSheet.create({});

export default LanguageSelectionScreen;
