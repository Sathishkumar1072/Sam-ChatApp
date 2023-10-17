import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';

const Wifi = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [allPeople, setAllPEople] = useState([]);
  const [stateBase64, setStateBase64] = useState(null);

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
        // console.log('responsebase64: ', response.assets?.[0]?.base64);
        let imageUri = response.uri || response.assets?.[0]?.uri;
        // setSelectedImage(imageUri);
        setStateBase64(response.assets?.[0]?.base64);
      }
    });
  };
  useEffect(() => {
    const getapiData = async () => {
      await axios
        .get('http://192.168.131.141:3000/api/Countries')
        .then(response => {
          // await  axios.get("https://jsonplaceholder.typicode.com/todos/1").then((response) => {
          console.log('responseA', response?.data);
          setAllPEople(response?.data);
        })
        .catch(error => {
          console.log('resError', error);
        });
    };
    getapiData();
  }, []);
  // console.log('stateBase64', stateBase64);
  // console.log('setSelectedImage ', selectedImage);
  const createTable = async () => {
    const TBLData = {
      TableName: 'SathishTable',
    };
    await axios
      .post('http://192.168.131.141:3000/api/create', TBLData)
      .then(response => {
        // await  axios.get("https://jsonplaceholder.typicode.com/todos/1").then((response) => {
        console.log('responseA', response?.data);
      })
      .catch(error => {
        console.log('resError', error);
      });
  };

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      {/* <TouchableOpacity onPress={() => createTable('SathishTable')}>
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
          Create Table
        </Text>
      </TouchableOpacity> */}

      <Text style={{color: '#ee11b8', fontSize: 24}}>Hello Sam...</Text>
      {/* <Text>{allPeople?.title}</Text>
      <View style={{padding: 2}}>
        {stateBase64 && (
          <Image
            // key={index}
            style={{
              width: '50%',
              height: '50%',
              borderRadius: '1px solid red',
              borderRadius: 5,
              objectFit: 'contain',
            }}
            source={{uri: `data:image/png;base64,${stateBase64}`}}
          />
        )}
        <TouchableOpacity onPress={() => openImagePicker()}>
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
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default Wifi;
