import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import {PermissionsAndroid, Platform, FlatList} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import React, {useEffect, useState} from 'react';
// import ImageViewer from 'react-native-image-viewer';
import ImageView from 'react-native-image-viewing';
import {showLoading} from '../../atoms/Atoms';
import {useRecoilState} from 'recoil';

const Gallery = () => {
  const [state, setState] = useState(null);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showLoader, setShowLoader] = useRecoilState(showLoading);
  const openImageViewer = index => {
    setViewerIndex(index);
    setViewerIsOpen(true);
  };

  const closeImageViewer = () => {
    setViewerIsOpen(false);
  };

  async function hasAndroidPermission() {
    const getCheckPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      if (Platform.Version >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  }

  async function savePicture() {
    setShowLoader(true);
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
    CameraRoll.getPhotos({
      first: 20000000,
      assetType: 'Photos',
    })
      .then(r => {
        setState({photos: r.edges});
        setShowLoader(false);
      })
      .catch(err => {
        //Error Loading Images
      });
  }
  const Item = ({title, index}) => {
    return (
      <TouchableOpacity onPress={() => openImageViewer(index)}>
        <View style={{padding: 2}}>
          <Image
            key={index}
            style={{
              width: 190,
              height: 190,
              borderRadius: 5,
            }}
            source={{uri: title.node.image.uri}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  React.useEffect(() => {
    savePicture();
  }, []);

  let AnsImg = [];
  state?.photos?.map((value, index) => {
    AnsImg.push({uri: value.node.image.uri});
  });
  // console.log('AnsImg', AnsImg);
  return (
    <View style={{backgroundColor: '#c7f2e8', flex: 1}}>
      <FlatList
        data={state?.photos}
        renderItem={({item, index}) => <Item title={item} index={index} />}
        keyExtractor={(item, index) => index}
        numColumns={2}
        // initialNumToRender={20}
      />
      {/* <ImageView
        imageUrls={state?.photos.map(image => ({url: image}))}
        index={viewerIndex}
        isVisible={viewerIsOpen}
        onClose={closeImageViewer}
      /> */}
      <ImageView
        keyExtractor={(item, index) => index}
        images={AnsImg}
        imageIndex={viewerIndex}
        visible={viewerIsOpen}
        onRequestClose={closeImageViewer}
      />
    </View>
  );
};

export default Gallery;
