import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Linking,
  Pressable,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const CameraTab = () => {
  const CameraRef = useRef(Camera);
  const devices = useCameraDevices();
  const [img, setSingleImg] = useState('');
  const [camView, setCamView] = useState('back');
  const [torch, setTorch] = useState(false);
  const device = camView === 'back' ? devices.back : devices.front;
  const requestCameraPermission = React.useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission == 'denied') {
      console.log('Permission not granted');
      await Linking.openSettings();
    }
  }, []);

  const destPath = `${RNFS.DocumentDirectoryPath}/capturedPicture.jpg`;
  const changeCamView = () => {
    camView === 'back' ? setCamView('front') : setCamView('back');
  };
  const captureImageEvent = async () => {
    try {
      if (CameraRef.current == null) {
        console.log('CameraRef', CameraRef, CameraRef.current);
        throw new Error('CameraRef is Null');
      }
      //takePhoto
      const Photo = await CameraRef.current.takeSnapshot({
        qualityPrioritization: 'quality',
        // flash: false,
        flash: `${camView === 'back' && torch ? 'on' : 'off'}`,
        enableAutoRedEyeReduction: true,
        quality: 85,
        skipMetadata: true,
      });
      saveImageToGallery(Photo);
      console.log('Cam', Photo);
      setSingleImg(Photo?.path);
      try {
        await RNFS.copyFile(Photo?.path, destPath);
        console.log('Picture saved successfully:', destPath);
      } catch (error) {
        console.error('Error saving picture:', error);
      }
    } catch (error) {
      console.log('CamERrr', error);
    }
  };
  const saveImageToGallery = async imageData => {
    try {
      // Save the image to the gallery
      const saveResult = await CameraRoll.saveToCameraRoll(imageData.path);

      if (saveResult) {
        console.log('Image saved to gallery successfully:', saveResult);
      } else {
        console.error('Failed to save image to gallery.');
      }
    } catch (error) {
      console.error('Error saving image to gallery:', error);
    }
  };
  console.log('Answer', RNFS.DocumentDirectoryPath);
  React.useEffect(() => {
    requestCameraPermission();
  }, []);
  if (device == null) return <Text>Loading</Text>;
  return (
    <>
      <View style={{flex: 1}}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          ref={CameraRef}
          // torch={torch}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          left: '50%',
          right: '50%',
          bottom: 20,
          flexDirection: 'row',
        }}>
        <Pressable
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}
          onPress={() => {
            captureImageEvent();
          }}>
          <Icon name="camera" size={22} color="black" />
        </Pressable>
        <Pressable
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}
          onPress={() => {
            changeCamView();
          }}>
          <MaterialCommunityIcons
            name="camera-flip"
            color={'black'}
            size={28}
          />
        </Pressable>
        <Pressable
          style={{
            width: 50,
            height: 50,
            backgroundColor: `${torch ? 'white' : 'rgba(38, 38, 38, 0.8)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}
          onPress={() => setTorch(!torch)}>
          <Icon name="flash" color={'black'} size={28} />
        </Pressable>
      </View>
      <View
        style={{
          width: 205,
          height: 205,
          position: 'absolute',
          margin: 5,
          borderColor: `${img ? 'white' : 'transparent'}`,
          borderWidth: 2,
          borderRadius: 5,
        }}>
        <Image
          source={{uri: 'file://' + img}}
          style={{
            width: 200,
            height: 200,
            objectFit: 'cover',
            borderColor: 'red',
            borderBottomWidth: 1,
          }}
        />
      </View>
    </>
  );
};

export default CameraTab;
