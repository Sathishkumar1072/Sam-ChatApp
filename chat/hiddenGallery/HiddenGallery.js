import {Avatar, Image} from 'react-native-elements';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import getUsersPhotos from '../UsersAllPhotos/GetUsersPhotos';
import ImageView from 'react-native-image-viewing';
import {showLoading} from '../../atoms/Atoms';
import {useRecoilState} from 'recoil';

const HiddenGallery = ({route}) => {
  const {getPhotosUserName} = route.params;
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [imageURL, setImageURL] = useState(null);
  const [showLoader, setShowLoader] = useRecoilState(showLoading);
  const dummyImage =
    'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x';

  const openImageViewer = index => {
    console.log('openImageViewer--->', index);
    setViewerIndex(index);
    setViewerIsOpen(true);
  };
  const closeImageViewer = () => {
    setViewerIsOpen(false);
  };

  React.useEffect(() => {
    // setShowLoader(true);
    getUsersPhotos(getPhotosUserName).flatMap(url => {
      setImageURL(url);
      // setShowLoader(false);
    });
  }, []);

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
            source={{uri: `data:image/png;base64,${title}` || dummyImage}}
          />
        </View>
      </TouchableOpacity>
    );
  };
  let AnsImg = [];
  imageURL?.map((value, index) => {
    return AnsImg.push({uri: `data:image/png;base64,${value}`});
  });

  return (
    <View style={{backgroundColor: '#c7f2e8', flex: 1}}>
      <FlatList
        data={imageURL}
        renderItem={({item, index}) => <Item title={item} index={index} />}
        keyExtractor={(item, index) => index}
        numColumns={2}
        // initialNumToRender={20}
      />
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
export default HiddenGallery;
