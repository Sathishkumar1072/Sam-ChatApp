import {View, Text, TextInput, TouchableOpacity, StatusBar} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Camera from './tabs/camera/Camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Map from './tabs/map/Map';
import Bluetooth from './tabs/bluetooth/Bluetooth';
import Wifi from './tabs/wifi/Wifi';
import Gallery from './tabs/gallery/Gallery';
import PDF from './tabs/pdf/PDF';

const TabsComponent = ({navigation}) => {
  const Tab = createBottomTabNavigator();
  return (
    <>
      <StatusBar backgroundColor={'#c7f2e8'} />
      <Tab.Navigator>
        <Tab.Screen
          name="Camera"
          component={Camera}
          options={{
            headerShown: false,
            swipeEnabled: false,
            tabBarLabel: 'Camera',
            tabBarIcon: ({color, size}) => (
              <Icon
                name="camera"
                size={18}
                color="black"
                //   style={{height: 20, width: '80px'}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={Map}
          options={{
            headerShown: false,
            swipeEnabled: false,
            tabBarLabel: 'Map',
            tabBarIcon: ({color, size}) => (
              <Icon name="map-marker" size={18} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Bluetooth"
          component={Bluetooth}
          options={{
            headerShown: false,
            swipeEnabled: false,
            tabBarLabel: 'Fingerprint',
            tabBarIcon: ({color, size}) => (
              // <Icon name="bluetooth-b" size={18} color="black" />
              <MaterialCommunityIcons
                name="fingerprint"
                color={'black'}
                size={20}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Wi-fi"
          component={Wifi}
          options={{
            headerShown: false,
            swipeEnabled: false,
            tabBarLabel: 'Wi-fi',
            tabBarIcon: ({color, size}) => (
              <Icon name="wifi" size={18} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Gallery"
          component={Gallery}
          options={{
            headerShown: false,
            swipeEnabled: false,
            tabBarLabel: 'Gallery',
            tabBarIcon: ({color, size}) => (
              <Icon name="file-o" size={18} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="PDF"
          component={PDF}
          options={{
            headerShown: false,
            swipeEnabled: false,
            tabBarLabel: 'PDF',
            tabBarIcon: ({color, size}) => (
              <Icon name="file-pdf-o" size={18} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabsComponent;
