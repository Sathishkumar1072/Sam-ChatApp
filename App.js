import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import MobRouter from './MobRouter';
import LandingPage from './LandingPage';
import {LogBox} from 'react-native';
import {RecoilRoot} from 'recoil';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  LogBox.ignoreAllLogs();
  return (
    <RecoilRoot>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor={'#c7f2e8'} />
        <MobRouter />
      </SafeAreaView>
    </RecoilRoot>
  );
};

export default App;
