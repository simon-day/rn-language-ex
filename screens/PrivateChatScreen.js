import React, { useState, useContext, useEffect } from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
// import { IconButton } from 'react-native-paper';
// import { AuthContext } from '../navigation/AuthProvider';
import 'firebase/firestore';
import * as firebase from 'firebase';
import { useSelector } from 'react-redux';
import { IconButton } from 'react-native-paper';

// import useStatsBar from '../utils/useStatusBar';

export default function PrivateChatScreen({ route }) {
  const user = useSelector((state) => state.auth.userId);
  const userData = useSelector((state) => state.user);

  const { sharedPhoto } = userData;

  const [messages, setMessages] = useState([]);
  const { chatRoomId, ownUsername } = route.params;
  //   const currentUser = user.toJSON();

  async function handleSend(messages) {
    const text = messages[0].text;

    firebase
      .firestore()
      .collection('chats')
      .doc(chatRoomId)
      .collection('messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: user,
          username: ownUsername,
          avatar: sharedPhoto,
        },
      });

    await firebase
      .firestore()
      .collection('chats')
      .doc(chatRoomId)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
          },
        },
        { merge: true }
      );
  }

  useEffect(() => {
    const messagesListener = firebase
      .firestore()
      .collection('chats')
      .doc(chatRoomId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            avatar: firebaseData.user.sharedPhoto,
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email,
            };
          }

          return data;
        });

        setMessages(messages);
      });

    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }, []);

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6646ee',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  }

  function renderLoading() {
    return (
      <View>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View>
          <IconButton icon="send-circle" size={32} color="#6646ee" />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View>
        <IconButton icon="chevron-double-down" size={36} color="#6646ee" />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return <SystemMessage {...props} />;
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{ _id: user }}
      placeholder="Type your message here..."
      alwaysShowSend
      showUserAvatar
      scrollToBottom
      // renderBubble={renderBubble}
      // renderLoading={renderLoading}
      // renderSend={renderSend}
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}
    />
  );
}

export const screenOptions = (navData) => {
  console.log('PARAMS: ', navData.route.params);
  // let chattingWithName = !!navData.route.params.username
  //   ? navData.route.params.username
  //   : navData.route.params.friendUsername;

  return {
    headerTitle: `Chatting with ${navData.route.params.friendUsername}`,
  };
};

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   sendingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bottomComponentContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   systemMessageWrapper: {
//     backgroundColor: '#6646ee',
//     borderRadius: 4,
//     padding: 5,
//   },
//   systemMessageText: {
//     fontSize: 14,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });
