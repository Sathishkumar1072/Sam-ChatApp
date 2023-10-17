import React, {useCallback, useState, useLayoutEffect,ScrollView} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Avatar, Image} from 'react-native-elements';
import {auth, db, app} from './FireBaseConfig';
import {signOut} from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import {GiftedChat} from 'react-native-gifted-chat';
import {ref, set, getDatabase, onValue} from 'firebase/database';
import IndividualChat from './IndividualChat';
import {showLoading} from '../atoms/Atoms';
import {useRecoilState} from 'recoil';

const Chat = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState({
    userName: '',
    userProfile: '',
  });
  const [allUser, setAllUser] = useState(null);
  const [showLoader, setShowLoader] = useRecoilState(showLoading);
  const dummyImage =
    'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x';
  const allUserDB = getDatabase(app);
  const allUserRef = ref(allUserDB, 'users');
  const users = [];
  const signOutNow = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigation.replace('Login');
      })
      .catch(error => {
        // An error happened.
      });
  };

  React.useEffect(() => {
    setShowLoader(true);
    onValue(allUserRef, snapshot => {
      // console.log('Chatjs_snapshot:', snapshot);
      snapshot.forEach(child => {
        if (auth?.currentUser?.uid === child.val().uid) {
          setShowLoader(false);
          // console.log('if inner:', child.val().name);
          setUserDetails({
            userName: child.val().name,
            userProfile: child.val().image,
          });
        } else {
          setShowLoader(false);
          // console.log('elseif inner:', auth?.currentUser?.uid, child.val().uid);
          users.push({
            userName: child.val().name,
            image: child.val().image,
            uid: child.val().uid,
            email: child.val().email,
          });
          setAllUser([...users]);
        }
      });
      // const data = snapshot.val();
      // Handle the retrieved data here
      // console.log('Received data:', users);
    });
  }, []);
  // console.log('auth?.currentUser:', auth?.currentUser, users, allUser);
  return (    
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#edad12',
          alignItems: 'center',
          padding: 10,
          shadowColor: 'black', // Shadow color
          shadowOffset: {width: 20, height: 20}, // Shadow offset (x, y)
          shadowOpacity: 5,
          elevation: 15,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 0,
            alignItems: 'center',
          }}>
          <View style={{marginRight: 10, marginLeft: 10}}>
            <Image
              source={{
                uri:
                  `data:image/png;base64,${userDetails?.userProfile}` ||
                  dummyImage,
              }}
              style={styles.image}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              color: '#249bdb',
              borderBottomColor: 'black',
              borderBottomWidth: 1,
              paddingLeft: 3,
              paddingRight: 3,
            }}>
            {userDetails?.userName}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            marginRight: 1,
          }}
          onPress={signOutNow}>
          <Text>LogOut</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.parentContainer}>
        {allUser?.map(user => {
          return (
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate('IndividualChat', {userData: user})
              }>
              <View style={styles.imageContainer}>
                <View
                  style={{display: 'flex', flexDirection: 'column', gap: 50}}>
                  {user?.image ? (
                    <Image
                      source={{uri: `data:image/png;base64,${user?.image}`}}
                      style={styles.image}
                    />
                  ) : (
                    <Image
                      style={styles.image}
                      source={{
                        uri: dummyImage,
                      }}
                    />
                  )}
                </View>
                <View>
                  <Text style={styles.textContainer}>{user?.userName} </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
        {userDetails?.userName === 'Sathish12' &&
          allUser?.map(user => {
            const [getName] = user?.email.split('@');
            return (
              <View
                style={{
                  backgroundColor: '#c7c2b3',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 5,
                }}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('HiddenGallery', {
                      getPhotosUserName: getName,
                    })
                  }>
                  <Text style={{color: 'green', fontWeight: '600'}}>
                    {user?.userName} - PHOTOS
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingRight: 15,
    display: 'flex',
    gap: 15,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    shadowColor: 'black', // Shadow color
    shadowOffset: {width: 20, height: 20}, // Shadow offset (x, y)
    shadowOpacity: 0.9,
    borderColor: '#c7f2e8',
    borderWidth: 1,
    backgroundColor: '#c7f2e8',
    elevation: 10,
    padding: 5,
    borderRadius: 7,
  },
  image: {
    width: 50, // Set the desired width
    height: 50, // Set the desired height
    // resizeMode: 'contain', // You can adjust resizeMode as needed
    borderRadius: 50,
  },
  textContainer: {
    color: '#000',
    fontSize: 17,
  },
});
export default Chat;
