import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {showLoading} from '../atoms/Atoms';
import {StyleSheet} from 'react-native';

const CustomSpinner = () => {
  const showLoader = useRecoilValue(showLoading);

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={showLoader}
      style={styles.activityIndicator}>
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#7b20df" />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  activityIndicator: {
    zIndex: 1100,
    backgroundColor: '#E6E6E6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: '#00000000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
export default CustomSpinner;
