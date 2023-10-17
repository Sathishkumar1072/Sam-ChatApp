import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {auth} from './FireBaseConfig';
import {signInWithEmailAndPassword} from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase/app';
import 'firebase/auth';
import UserList from './UserList';
import {photoURL, showLoading} from '../atoms/Atoms';
import {useRecoilState, useRecoilValue} from 'recoil';
import useUsersPhotos from './UsersAllPhotos/UsersPhotos';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoader, setShowLoader] = useRecoilState(showLoading);
  const [uniqueUserPhoto, setUniqueUserPhoto] = useRecoilState(photoURL);
  const {convertImagesToBase64} = useUsersPhotos();
  const openRegisterScreen = () => {
    navigation.navigate('Register');
  };

  const signin = async () => {
    // await firebase.auth().signInWithEmailAndPassword(email, password);
    // const user = firebase.auth().currentUser;
    // const senderId = user.uid;

    // const sendMessage = (text, senderId, receiverId) => {
    //     const messageRef = firebase.database().ref('messages').child('chatRoom1'); // Replace 'chatRoom1' with the appropriate chat room.
    //     const newMessageRef = messageRef.push();
    //     const message = {
    //       text: text,
    //       senderId: senderId,
    //       receiverId: receiverId,
    //       timestamp: firebase.database.ServerValue.TIMESTAMP,
    //     };
    //     newMessageRef.set(message);
    //   };
    setShowLoader(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        setShowLoader(false);
        console.log('userCredential --->', userCredential?.user?.email);
        const email = userCredential?.user?.email;
        const [username] = email.split('@');

        setUniqueUserPhoto([...uniqueUserPhoto, username]);
        console.log('uniqueUserPhoto--->',[...new Set(uniqueUserPhoto)] );
        const filterByUser = [...new Set(uniqueUserPhoto)]
        !filterByUser.includes(username) &&  convertImagesToBase64(username);
        navigation.navigate('Chat');
      })
      .catch(error => {
        setShowLoader(false);
        alert('Invalid UserName or Password');
      });
  };

  return (
    <View style={styles.container}>
      {/* <UserList /> */}
      <Input
        placeholder="Enter your email"
        label="Email"
        leftIcon={{type: 'material', name: 'email'}}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <Input
        placeholder="Enter your password"
        label="Password"
        leftIcon={{type: 'material', name: 'lock'}}
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
          width: '100%',
        }}>
        <Button title="Sign in" style={styles.button} onPress={signin} />
        <Button
          title="Register"
          style={styles.button}
          onPress={openRegisterScreen}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginTop: 100,
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
});

export default Login;
