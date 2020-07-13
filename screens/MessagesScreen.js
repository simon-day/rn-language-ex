import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../Fire';
import * as firebase from 'firebase';
import 'firebase/firestore';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Animated,
  FlatList,
  Button,
  View,
  Image,
  RefreshControl,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ChatPreview from '../components/ChatPreview';
import calculateDistance from '../utilities/calculateDistance';
// import Swipeable from 'react-native-swipeable-row';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';

// I18nManager.allowRTL(true);

const MessagesScreen = (props) => {
  const [chatPreviewList, setChatPreviewList] = useState([]);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [chatData, setChatData] = useState([]);
  const userCoords = useSelector((state) => state.user.location);
  const userId = useSelector((state) => state.auth.userId);

  // const hideMessage = async (chatRoomId) => {
  //   console.log('Message hidden with chatroomID: ', chatRoomId);
  //   setIsHidden(true);
  // };

  const renderRightActions = (chatRoomId, ownId, progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity
        style={styles.rightAction}
        onPress={() => hideChat(chatRoomId, ownId)}
      >
        {/* <Animated.Text style={[styles.actionText]}>Archive</Animated.Text> */}
        <Ionicons style={[styles.actionText]} size={30} name="ios-trash" />
      </TouchableOpacity>
    );
  };

  const hideChat = async (chatRoomId, ownId) => {
    await firebase
      .firestore()
      .collection('chats')
      .doc(chatRoomId)
      .update({ showTo: firebase.firestore.FieldValue.arrayRemove(ownId) });
  };

  useEffect(() => {
    const getChats = async () => {
      firebase.auth().onAuthStateChanged(async (user) => {
        await firebase
          .firestore()
          .collection('chats')
          // .where('userIds', 'array-contains', user.uid)
          .where('showTo', 'array-contains', user.uid)
          .onSnapshot(async (res) => {
            const chats = res.docs
              .map((doc) => {
                let latestMessage;

                if (doc.get('latestMessage') !== undefined) {
                  latestMessage = doc.data().latestMessage;
                } else {
                  latestMessage = '';
                }

                const distanceFromUser = Math.round(
                  calculateDistance(
                    doc.data().userData.userOneData.location,
                    doc.data().userData.userTwoData.location
                  )
                );

                let friendId;
                let username;
                let sharedPhoto;
                let userData;

                if (doc.data().userData.userOneData.userId === userId) {
                  userData = { ...doc.data().userData.userTwoData };
                  friendId = doc.data().userData.userTwoData.userId;
                  username = doc.data().userData.userTwoData.username;
                  sharedPhoto = doc.data().userData.userTwoData.sharedPhoto;
                } else {
                  userData = { ...doc.data().userData.userOneData };
                  friendId = doc.data().userData.userOneData.userId;
                  username = doc.data().userData.userOneData.username;
                  sharedPhoto = doc.data().userData.userOneData.sharedPhoto;
                }

                return {
                  chatRoomId: doc.id,
                  friendId,
                  username,
                  sharedPhoto,
                  // userIds: doc.data().userIds,
                  userData,
                  distanceFromUser,
                  latestMessage,
                  hideFn: () => hideChat(doc.id),
                };
              })
              .filter((chat) => chat.latestMessage.text !== '')
              .sort(
                (a, b) => b.latestMessage.createdAt - a.latestMessage.createdAt
              );

            setChatData(chats);
          });
      });
    };

    getChats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {chatData && (
        <FlatList
          keyExtractor={(item) => item.friendId}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
          showsVerticalScrollIndicator={false}
          data={chatData}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={renderRightActions.bind(
                this,
                item.chatRoomId,
                userId
              )}
            >
              <ChatPreview
                hideFn={item.hideFn}
                navigation={props.navigation}
                userData={item.userData}
                latestMessage={item.latestMessage}
                chatRoomId={item.chatRoomId}
                username={item.username}
                distanceFromUser={item.distanceFromUser}
                image={item.sharedPhoto}
              />
            </Swipeable>
          )}
        />
      )}
    </SafeAreaView>
  );
};

// return (
//   <SafeAreaView style={styles.container}>
//     {chatPreviewList && !isFetching && (
//       <FlatList
//         keyExtractor={(item) => item.chatRoomId}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         showsVerticalScrollIndicator={false}
//         data={chatPreviewList}
//         renderItem={({ item }) => (
//           <ChatPreview
//             navigation={props.navigation}
//             userData={item}
//             username={item.username}
//             //   distanceFromUser={item.distanceFromUser}
//             image={item.sharedPhoto}
//           />
//         )}
//       />
//     )}
//   </SafeAreaView>
// );

// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: 20,
//     height: '100%',
//   },
//   buttonsContainer: {
//     // flex: 1,
//     height: 40,
//     // backgroundColor: 'white',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     margin: 10,
//   },
// });

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    // margin: 30,
    height: '100%',
  },
  actionText: {
    // backgroundColor: 'red',
    color: 'white',
    fontWeight: '600',
    paddingHorizontal: 30,
    // paddingVertical: 23,
    // paddingHorizontal: 23,
    textAlign: 'center',
  },
  // rectButton: {
  //   flex: 1,
  //   height: 80,
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   justifyContent: 'space-between',
  //   flexDirection: 'column',
  //   backgroundColor: 'white',
  // },
  rightAction: {
    justifyContent: 'center',
    backgroundColor: 'red',
    // paddingHorizontal: 32,
    // flex: 1,
    alignItems: 'flex-end',
    // backgroundColor: 'white',
    // backgroundColor: 'red',
  },
  buttonsContainer: {
    // flex: 1,
    height: 40,
    // backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 10,
  },
});

export default MessagesScreen;
