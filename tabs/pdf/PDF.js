import {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const PDF = () => {
  const getDownloadPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'File Download Permission',
          message: 'Your permission is required to save Files to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;
    } catch (err) {
      console.log('err', err);
    }
  };
  const pdfPermission = async () => {
    const fileUrl =
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

    if (Platform.OS === 'android') {
      getDownloadPermissionAndroid().then(granted => {
        if (granted) {
          downloadPDF(fileUrl);
        }
      });
    } else {
      downloadPDF(fileUrl).then(res => {
        RNFetchBlob.ios.previewDocument(res.path());
      });
    }
  };
  const downloadPDF = async pdfUrl => {
    try {
      const downloadDir = RNFetchBlob.fs.dirs.DownloadDir;
      const fileName = 'Sam.pdf';
      const filePath = `${downloadDir}/${fileName}`;
      const configOptions = Platform.select({
        ios: {
          fileCache: true,
          path: filePath,
        },
        android: {
          fileCache: true,
          path: filePath,
          addAndroidDownloads: {
            // Related to the Android only
            useDownloadManager: true,
            notification: true,
            path: filePath,
            description: 'File',
          },
        },
      });
      const response = await RNFetchBlob.config(configOptions).fetch(
        'GET',
        pdfUrl,
      );
      console.log('path-->', response.path());
    } catch (error) {
      console.log('Error while downloading PDF:', error);
    }
  };
  // useEffect(() => {
  //   pdfPermission();
  // }, []);
  return (
    <View style={{display:"flex",alignItems:'center',justifyContent:"center",backgroundColor: '#c7f2e8',flex:1}}>
      <TouchableOpacity onPress={()=>pdfPermission()}>
        <Text style={{backgroundColor: 'rgba(92, 90, 143, 0.8)',padding:20,borderRadius:15,}}>Click to Download PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PDF;
