import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {TouchableOpacity, Text, View, ScrollView} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import {db, auth, app} from './FireBaseConfig';
import {ref, set, getDatabase, onValue} from 'firebase/database';
import {v4 as uuidv4} from 'uuid';
import uuid from 'react-native-uuid';
import {Button, Image, Input} from 'react-native-elements';
import {showLoading} from '../atoms/Atoms';
import {useRecoilState} from 'recoil';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
// import {signOut} from 'firebase/auth';

const IndividualChat = ({route}) => {
  const [showLoader, setShowLoader] = useRecoilState(showLoading);
  const {userData} = route.params;
  // console.log('userData-->', userData);
  //   const [messages, setMessages] = useState([]);

  //   const onSignOut = () => {
  //     signOut(auth).catch(error => console.log('Error logging out: ', error));
  //   };

  //   useLayoutEffect(() => {
  //     navigation.setOptions({
  //       headerRight: () => (
  //         <TouchableOpacity
  //           style={{
  //             marginRight: 10,
  //           }}
  //           onPress={onSignOut}>
  //           <Text>Logout</Text>
  //         </TouchableOpacity>
  //       ),
  //     });
  //   }, [navigation]);

  //   const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState(null);
  const senderID = auth?.currentUser?.uid;
  const receiverID = userData?.uid;
  const getChatRoomId = (user1Id, user2Id) => {
    // Sort the user IDs to ensure consistency in the chat room ID
    const sortedIds = [user1Id, user2Id].sort();
    // Concatenate the sorted user IDs with a separator
    const chatRoomId = sortedIds.join('_');
    return chatRoomId;
  };
  useEffect(() => {
    setShowLoader(true);
    const chatRoomId = getChatRoomId(senderID, receiverID); // Define a function to generate unique chat room IDs
    // const messagesRef = firebase.database().ref(`chats/${chatRoomId}/messages`);
    const db = getDatabase(app);
    const messagesRef = ref(db, `chats/${chatRoomId}/messages`);
    onValue(messagesRef, snapshot => {
      const messageList = [];
      // console.log('snapshotchi -->', snapshot);
      // messageList.push(snapshot);
      snapshot.forEach(child => {
        // console.log('child -->', child?.val());
        messageList.push({
          _id: child.val().id,
          text: child.val().text,
          senderID: child.val().senderID,
          receiverID: child.val().receiverID,
          createdAt: child.val().createdAt,
          images: child.val().images,
        });
      });

      // const sortedMessage = messageList.sort((a, b) => {
      //   console.log(
      //     'Samssss->',
      //     a.createdAt > b.createdAt ? 1 : a.createdAt < b.createdAt ? -1 : 0,
      //   );
      //   return a.createdAt > b.createdAt
      //     ? 1
      //     : a.createdAt < b.createdAt
      //     ? -1
      //     : 0;
      // });
      // function compareByDate(a, b) {
      //   const dateA = new Date(
      //     a.createdAt.replace(
      //       /(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+) (AM|PM)/,
      //       '$2/$1/$3 $4 $5',
      //     ),
      //   );
      //   const dateB = new Date(
      //     b.createdAt.replace(
      //       /(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+) (am|pm)/,
      //       '$2/$1/$3 $4 $5',
      //     ),
      //   );
      //   return dateA - dateB;
      // }
      const sortedMessage = messageList.sort((a, b) => {
        return a.createdAt > b.createdAt
          ? 1
          : a.createdAt < b.createdAt
          ? -1
          : 0;
      });
      // Sort the data array by createdAt
      // const sortedMessage = messageList.sort(compareByDate);
      // console.log('sortedMessage--->', sortedMessage);
      setMessages(sortedMessage);
      setShowLoader(false);
    });
    // messagesRef.on('value', snapshot => {
    //   const messageList = [];
    //   snapshot.forEach(child => {
    //     messageList.push({
    //       id: child.key,
    //       text: child.val().text,
    //       senderId: child.val().senderId,
    //     });
    //   });
    //   setMessages(messageList);
    // });
  }, []);
  const handleSendMessage = async (message, photosURL) => {
    setShowLoader(true);
    const chatRoomId = await getChatRoomId(senderID, receiverID);
    // const messagesRef = firebase.database().ref(`chats/${chatRoomId}/messages`);
    // messagesRef.push({
    //   text: message,
    //   senderId: auth?.currentUser?.uid,
    // });
    const timestamp = new Date().toISOString();
    const db = getDatabase(app);
    const messagesRef = ref(db, `chats/${chatRoomId}/messages/` + uuid.v1());
    // await set(messagesRef, message);

    const date = new Date(timestamp);

    let day = date.getUTCDate();
    let month = date.getUTCMonth() + 1; // Months are zero-based, so add 1
    let year = date.getUTCFullYear();
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    // Convert to 12-hour time format
    hours = hours % 12 || 12;
    const updatedSeconds = seconds?.toString().length === 1 ? '0' + seconds : seconds;
    const formattedDateTime = `${day}/${month}/${year}, ${hours}:${minutes}:${updatedSeconds} ${ampm}`;
    // console.log('formattedDateTime--->', formattedDateTime, updatedSeconds);

    await set(messagesRef, {
      // ...messages,
      id: Math.random(),
      text: message,
      senderID: senderID,
      receiverID: receiverID,
      createdAt: formattedDateTime,
      images: photosURL,
    });
    setText('');
    setShowLoader(false);
  };

  //   useEffect(() => {
  //     const collectionRef = collection(db, 'chats');
  //     const q = query(collectionRef, orderBy('createdAt', 'desc'));

  //     const unsubscribe = onSnapshot(q, querySnapshot => {
  //       setMessages(
  //         querySnapshot.docs.map(doc => ({
  //           _id: doc.data()._id,
  //           createdAt: doc.data().createdAt.toDate(),
  //           text: doc.data().text,
  //           user: doc.data().user,
  //         })),
  //       );
  //     });

  //     return () => unsubscribe();
  //   }, []);
  // const onSend = useCallback((messages = []) => {
  //   setMessages(previousMessages =>
  //     GiftedChat.append(previousMessages, messages),
  //   );
  //   const {_id, createdAt, text, user} = messages[0];
  //   addDoc(collection(db, 'chats'), {
  //     _id,
  //     createdAt,
  //     text,
  //     user,
  //   });
  // }, []);
  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        console.log('responsebase64: ', response.assets?.[0]?.fileName);
        let imageUri = response.uri || response.assets?.[0]?.uri;
        // setSelectedImage(imageUri);
        // setStateBase64({
        //   fileName: response.assets?.[0]?.fileName,
        //   fileURL: response.assets?.[0]?.base64,
        // });
        // setAvatar(response.assets?.[0]?.base64);
        handleSendMessage('', response.assets?.[0]?.base64);
      }
    });
  };

  return (
    <View style={{flex: 5}}>
      <ScrollView>
        <View style={{flex: 5}}>
          {messages?.map(value => {
            return (
              <View
                style={{
                  display: 'flex',
                  justifyContent:
                    value.senderID === senderID ? 'flex-end' : 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {(value?.text && (
                  <View>
                    <Text
                      style={{
                        color: value.senderID === senderID ? 'red' : 'blue',
                        marginTop: 5,
                        backgroundColor: '#768985',
                        fontSize: 17,
                        borderRadius: 10,
                        padding: 5,
                      }}>
                      {value?.text}
                    </Text>
                    <Text style={{color: '#94766b'}}>{value?.createdAt}</Text>
                  </View>
                )) ||
                  (value?.images && (
                    <View>
                      <Image
                        // key={index}
                        style={{
                          width: 200,
                          height: 200,
                          borderRadius: 5,
                          objectFit: 'contain',
                        }}
                        source={{
                          uri: `data:image/png;base64,${value?.images}`,
                        }}
                      />
                      <Text>{value?.createdAt}</Text>
                    </View>
                  ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <Input
        placeholder="Type your message..."
        value={text}
        onChangeText={text => setText(text)}
        style={{
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 0,
        }}
      />
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '90%',
          }}>
          <Button
            buttonStyle={{width: '100%'}}
            title="Send"
            onPress={() => handleSendMessage(text, '')}
          />
        </View>
        <View
          style={{
            width: '15%',
          }}>
          <TouchableOpacity onPress={() => openImagePicker()}>
            <Icon
              name="photo"
              size={28}
              color="black"
              // style={{height: 100, width: '80px'}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default IndividualChat;
