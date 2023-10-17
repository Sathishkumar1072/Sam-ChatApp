import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomSpinner from './spinner/Spinner';

const LandingPage = ({navigation}) => {
  const arrowIcon = (
    <Icon
      name="arrow-right"
      size={18}
      color="white"
      style={{height: 20, width: '80px'}}
    />
  );
  return (
    <>
      <View
        style={{
          backgroundColor: '#c7f2e8',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 50,
        }}>
        <Text style={{color: 'yellow', fontSize: 28, color: '#014746'}}>
          Welcome to my{' '}
          <Text style={{ fontSize: 28, color: '#820df2'}}>
            Sam-App
          </Text>
        </Text>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('TabsComponent')}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // marginTop: 20,
              // backgroundColor:'red'
              borderColor: 'white',
              borderWidth: 1,
              backgroundColor: 'white', // You may need to set a background color for the shadow to be visible
              padding: 10,
              shadowColor: 'black', // Shadow color
              shadowOffset: {width: 20, height: 20}, // Shadow offset (x, y)
              shadowOpacity: 0.9, // Shadow opacity (0 to 1)
              borderRadius: 10,
              elevation: 15,
            }}>
            <Text style={{color: 'yellow', fontSize: 18, color: '#014746'}}>
              Tap to Access Device Specification
            </Text>

            <View
              style={{
                backgroundColor: 'green',
                height: 40,
                width: 40,
                borderRadius: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              {arrowIcon}
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // marginTop: 20,
              // backgroundColor:'red'
              borderColor: 'white',
              borderWidth: 1,
              backgroundColor: 'white', // You may need to set a background color for the shadow to be visible
              padding: 10,
              // shadowColor: 'black', // Shadow color
              // shadowOffset: {width: 20, height: 20}, // Shadow offset (x, y)
              shadowOpacity: 0.9, // Shadow opacity (0 to 1)
              borderRadius: 10,
              elevation: 15,
            }}>
            <Text style={{color: '#014746', fontSize: 18}}>
              Tap to Start Chat
            </Text>
            <MaterialCommunityIcons
              name="message-reply-text"
              color={'green'}
              size={40}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <CustomSpinner />
    </>
  );
};

export default LandingPage;
