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
      snapshot.forEach(child => {
        var inputDateString = child.val().createdAt;

        // Create a Date object from the input string
        var date = new Date(inputDateString);

        // Convert the UTC date to local date and time
        var localDate = new Date(date);

        // Input date string
        var inputDateString = localDate;

        // Create a Date object from the input string
        var date = new Date(inputDateString);

        // Extract date components
        var day = date.getDate();
        var month = date.getMonth() + 1; // Months are zero-based, so add 1
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var amOrPm = hours >= 12 ? 'PM' : 'AM';

        // Adjust the hours if they are greater than 12
        if (hours > 12) {
          hours -= 12;
        }

        // Format the components into the desired string
        var formattedDateString = `${day}/${month}/${year}, ${hours
          .toString()
          .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')} ${amOrPm}`;

        // console.log('formattedDateStringNew--->', formattedDateString);

        messageList.push({
          _id: child.val().id,
          text: child.val().text,
          senderID: child.val().senderID,
          receiverID: child.val().receiverID,
          createdAt: formattedDateString,
          images: child.val().images,
        });
      });

      const sortedMessage = messageList.sort((a, b) => {
        return a.createdAt > b.createdAt
          ? 1
          : a.createdAt < b.createdAt
          ? -1
          : 0;
      });

      // console.log('sortedMessage--->', sortedMessage);
      setMessages(sortedMessage);
      setShowLoader(false);
    });
  }, []);
  const handleSendMessage = async (message, photosURL) => {
    setShowLoader(true);
    const chatRoomId = await getChatRoomId(senderID, receiverID);
    const timestamp = new Date().toUTCString();
    const db = getDatabase(app);
    const messagesRef = ref(db, `chats/${chatRoomId}/messages/` + uuid.v1());

    await set(messagesRef, {
      // ...messages,
      id: Math.random(),
      text: message,
      senderID: senderID,
      receiverID: receiverID,
      createdAt: timestamp,
      images: photosURL,
    });

    setShowLoader(false);
    setText('');
  };

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
                    {value?.createdAt && (
                      <Text style={{color: '#94766b'}}>{value?.createdAt}</Text>
                    )}
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
                      {value?.createdAt && (
                        <Text style={{color: '#94766b'}}>
                          {value?.createdAt}
                        </Text>
                      )}
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
