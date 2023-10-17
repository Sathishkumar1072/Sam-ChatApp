import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, Button, Image, Text} from 'react-native-elements';
import {auth, app} from './FireBaseConfig';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {ref, set, getDatabase} from 'firebase/database';
import {useRecoilState} from 'recoil';
import {showLoading} from '../atoms/Atoms';
import {TouchableOpacity} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Register = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showLoader, setShowLoader] = useRecoilState(showLoading);
  const [stateBase64, setStateBase64] = useState({fileName: '', fileURL: ''});

  const AddUser = async (name, email, password, avatar, uid) => {
    console.log('AddUser', name, email, uid);
    try {
      const db = getDatabase(app);
      const usersRef = ref(db, 'users/' + uid);
      await set(usersRef, {
        name: name,
        email: email,
        image: avatar,
        password: password,
        uid: uid,
      });
    } catch (err) {
      console.log('AddUser_--Error  -->', err.message);
      Alert.alert(err.message);
    }
  };

  const register = async () => {
    console.log('register');
    setShowLoader(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Registered
        const uid = userCredential.user?.uid;
        console.log('User --->', uid);
        //   updateProfile(user, {
        //     displayName: name,
        //     photoURL: avatar
        //       ? avatar
        //       : 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x',
        //   })
        AddUser(name, email,password, avatar, uid)
          .then(() => {
            setShowLoader(false);
            alert('Registered, please login.');
            navigation.navigate('Login')
          })
          .catch(error => {
            setShowLoader(false);
            alert(error.message);
          });
      })
      .catch(error => {
        setShowLoader(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('error.message', error.message);
        alert('Invalid Email ex:sample@gmail.com');
      });
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
        // setSelectedImage(imageUri);
        setStateBase64({
          fileName: response.assets?.[0]?.fileName,
          fileURL: response.assets?.[0]?.base64,
        });
        setAvatar(response.assets?.[0]?.base64);
      }
    });
  };
  // console.log("stateBase64 --->",stateBase64)
  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your name"
        label="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <Input
        placeholder="Enter your email"
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <Input
        placeholder="Enter your password"
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      {/* <View style={{display:"flex",flexDirection:"column"}}> */}
      {/* <Input
          placeholder="Select your profile picture"
          label="Profile Picture"
          value={avatar}
          onChangeText={text => setAvatar(text)}
        /> */}
      <TouchableOpacity onPress={() => openImagePicker()}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0b00ff',
            padding: 10,
            borderRadius: 15,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: '600', fontSize: 16, color: '#d0dbd3'}}>
            Select your profile picture
          </Text>

          <MaterialCommunityIcons
            name="camera-flip"
            color={'#d0dbd3'}
            size={28}
          />
        </View>
      </TouchableOpacity>
      {/* </View> */}
      {/* 
      <Text
        style={{
          backgroundColor: 'rgba(92, 90, 143, 0.8)',
          padding: 20,
          borderRadius: 15,
          width: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        Click to Upload a IMAGE
      </Text> */}
      <View style={{width: '100%'}}>
        <Text>{stateBase64?.fileName}</Text>
        {stateBase64?.fileURL && (
          <Image
            // key={index}
            style={{
              width: '50%',
              height: '50%',
              borderRadius: '1px solid red',
              borderRadius: 5,
              objectFit: 'contain',
            }}
            source={{uri: `data:image/png;base64,${stateBase64?.fileURL}`}}
          />
        )}
        <View style={{width: '100%'}}>
          <Button title="Register" onPress={register} style={styles.button} />
        </View>
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
    // width: 370,
    // marginTop: 10,
  },
});

export default Register;
