import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';

const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Portugese',
  'Russian',
  'Arabic',
  'Swedish',
  'Korean',
  'Finnish',
  'Greek',
  'Hebrew',
];

const LanguageSelection = (props) => {
  return (
    <ScrollView>
      {languages.map((language, i) => (
        <ListItem
          key={i}
          title={language}
          //   subtitle={l.subtitle}
          bottomDivider
          rightIcon={{ name: 'add' }}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default LanguageSelection;
