import {useState, useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFetchBlob from 'rn-fetch-blob';
import {getDatabase} from 'firebase/database';
import {app} from '../FireBaseConfig';
import {ref, set} from 'firebase/database';
import uuid from 'react-native-uuid';

const useUsersPhotos = () => {
  console.log('Users');
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

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
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    return CameraRoll.getPhotos({
      first: 5,
      assetType: 'Photos',
    })
      .then(r => {
        return r.edges.map(value => value.node.image.uri);
      })
      .catch(err => {
        // Handle error
        return [];
      });
  }

  async function convertToBase64(uri) {
    try {
      const response = await RNFetchBlob.fs.readFile(uri, 'base64');
      return response;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  }

  async function storeBase64(base64Images, userName) {
    try {
      const db = getDatabase(app);
      const usersRef = ref(db, `${userName}photos/` + uuid.v1());
      await set(usersRef, base64Images);
    } catch (err) {
      console.log('AddUser_--Error  -->', err.message);
    }
  }

  async function convertImagesToBase64(userName) {
    console.log('convertImagesToBase64  -->', userName);
    const imageUris = await savePicture();
    if (imageUris.length === 0) {
      return; // No images to convert
    }

    const base64Images = [];
    for (const uri of imageUris) {
      const base64Image = await convertToBase64(uri);
      if (base64Image) {
        base64Images.push(base64Image);
      }
    }

    await storeBase64(base64Images, userName);
  }

  return {
    viewerIsOpen,
    viewerIndex,
    openImageViewer,
    closeImageViewer,
    convertImagesToBase64,
  };
};

export default useUsersPhotos;
