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
  FlatList,
  Button,
  View,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import ChatPreview from '../components/ChatPreview';
import calculateDistance from '../utilities/calculateDistance';

const MessagesScreen = (props) => {
  const [chatPreviewList, setChatPreviewList] = useState([]);
  const [chatData, setChatData] = useState([]);
  const userCoords = useSelector((state) => state.user.location);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const getChats = async () => {
      firebase.auth().onAuthStateChanged(async (user) => {
        await firebase
          .firestore()
          .collection('chats')
          .where('userIds', 'array-contains', user.uid)
          .onSnapshot(async (res) => {
            const chats = res.docs.map((doc) => {
              //   chatPreviewData = doc
              //     .data()
              //     .userData.find((user) => user.userId !== userId);
              return {
                chatRoomId: doc.id,
                userIds: doc.data().userIds,
                userData: doc.data().userData,
              };
            });

            // await setChatData(chatPreviewData);
            await setChatPreviewList(chats);

            await setChatData(
              chats.map((chat) => {
                const distanceFromUser = Math.round(
                  calculateDistance(
                    chat.userData.userOneData.location,
                    chat.userData.userTwoData.location
                  )
                );
                if (chat.userData.userOneData.userId !== userId) {
                  return { ...chat.userData.userOneData, distanceFromUser };
                } else {
                  return { ...chat.userData.userTwoData, distanceFromUser };
                }
              })
            );
            console.log(chatData);
          });
      });
    };

    getChats();
  }, []);

  return (
    <SafeAreaView>
      {chatData && (
        <FlatList
          keyExtractor={(item) => item.userId}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
          showsVerticalScrollIndicator={false}
          data={chatData}
          renderItem={({ item }) => (
            <ChatPreview
              navigation={props.navigation}
              userData={item}
              username={item.username}
              distanceFromUser={item.distanceFromUser}
              image={item.sharedPhoto}
            />
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
    height: '100%',
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
