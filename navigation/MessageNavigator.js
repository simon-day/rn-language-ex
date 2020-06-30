import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MessagesScreen from '../screens/MessagesScreen';
import PrivateChatScreen, {
  screenOptions as privateChatScreenOptions,
} from '../screens/PrivateChatScreen';

const MessageStackNavigator = createStackNavigator();

const MessageNavigator = () => {
  return (
    <MessageStackNavigator.Navigator>
      <MessageStackNavigator.Screen
        name="Messages"
        component={MessagesScreen}
        // options={findFriendsScreenOptions}
      />
      <MessageStackNavigator.Screen
        name="PrivateChat"
        component={PrivateChatScreen}
        options={privateChatScreenOptions}
        // options={languageselectionScreenOptions}
      />
    </MessageStackNavigator.Navigator>
  );
};

export default MessageNavigator;
