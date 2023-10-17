// import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LandingPage from './LandingPage';
import TabsComponent from './TabsComponent';
import Login from './chat/Login';
import Register from './chat/Register';
import Chat from './chat/Chat';
import IndividualChat from './chat/IndividualChat';
import UsersPhotos from './chat/UsersAllPhotos/UsersPhotos';
import HiddenGallery from './chat/hiddenGallery/HiddenGallery';
const MobRouter = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={LandingPage}
          options={{headerShown: false, swipeEnabled: false}}
        />
        <Stack.Screen
          name="TabsComponent"
          component={TabsComponent}
          options={{headerShown: false, swipeEnabled: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false, swipeEnabled: false}}
        />
        <Stack.Screen name="Register" component={Register} />
        {/* <Stack.Screen name="Register" component={UsersPhotos} /> */}
        <Stack.Screen name='Chat' component={Chat}  options={{ headerShown: false,swipeEnabled: false}}/>
        <Stack.Screen name='IndividualChat' component={IndividualChat}  options={{ headerShown: false,swipeEnabled: false}}/>
        <Stack.Screen name='HiddenGallery' component={HiddenGallery}  options={{ headerShown: false,swipeEnabled: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MobRouter;
