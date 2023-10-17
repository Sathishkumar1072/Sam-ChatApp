import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const Map = () => {
  Geolocation.setRNConfiguration({
    config: {
      skipPermissionRequests: true,
      authorizationLevel: 'always',
      locationProvider: 'android',
    },
  });
  const [location, setLocation] = useState({latitude: '', longitude: ''});
  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      console.log(
        'info--->i',
        info,
        info?.coords.latitude,
        info?.coords.longitude,
      );
      setLocation({
        ...location,
        latitude: info?.coords.latitude,
        longitude: info?.coords.longitude,
      });
    });
  }, [location?.latitude]);

  console.log('setLocation', location);

  return (
    <View>
      {location?.latitude && (
        <MapView
          initialRegion={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: 0.0009,
            longitudeDelta: 0.0009,
          }}
          style={{width: '100%', height: '100%'}}>
          <Marker
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
            title="Sam"
            description="Hello Sam"
          />
        </MapView>
      )}
    </View>
  );
};

export default Map;
