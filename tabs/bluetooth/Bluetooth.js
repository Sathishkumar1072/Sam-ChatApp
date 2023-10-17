import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Biometrics, {BiometryTypes} from 'react-native-biometrics';

const Bluetooth = () => {
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkBiometricsSupport();
  }, []);
  const checkBiometricsSupport = async () => {
    const rnBiometrics = new Biometrics();

    rnBiometrics.isSensorAvailable().then(resultObject => {
      const {available, biometryType} = resultObject;
      if (available && biometryType === BiometryTypes.TouchID) {
        console.log('TouchID is supported');
      } else if (available && biometryType === BiometryTypes.FaceID) {
        console.log('FaceID is supported');
      } else if (available && biometryType === BiometryTypes.Biometrics) {
        console.log('Biometrics is supported');
        setIsFingerprintEnabled(true);
      } else {
        console.log('Biometrics not supported');
      }
    });
  };
  const authenticateWithBiometrics = async () => {
    try {
      const rnBiometrics = new Biometrics();
      const result = await rnBiometrics?.simplePrompt({
        promptMessage: 'Authenticate with your fingerprint',
      });
      if (result.success) {
        // Authentication successful
        setAuthenticated(true);
        // Retrieve user credentials from AsyncStorage
        const savedPassword = await AsyncStorage.getItem('password');
        console.log('FingerPrintstoredPassword', savedPassword);
        if (savedPassword) {
          setPassword(savedPassword);
        }
      } else {
        // Authentication failed
        Alert.alert('Authentication failed');
      }
    } catch (error) {
      console.error('Biometrics authentication error:', error);
    }
  };

  const signInWithPassword = async () => {
    // Implement your password-based authentication logic here
    // For example, you can prompt the user to enter their password
    // and compare it with the stored password in AsyncStorage
    const storedPassword = await AsyncStorage.getItem('password');
    console.log('storedPassword', password, storedPassword);

    if (password === storedPassword) {
      setAuthenticated(true);
    } else {
      Alert.alert('Incorrect password');
    }
  };

  return (
      <View style={styles.container}>
        {isFingerprintEnabled && (
          <TouchableOpacity onPress={authenticateWithBiometrics}>
            <Text style={{color:"orange",fontSize:20}}>Tab to Sign In with Fingerprint</Text>
          </TouchableOpacity>
        )}

        <Text>OR</Text>

        <Text>Password:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          onChangeText={text => setPassword(text)}
          value={password}
        />
        <TouchableOpacity onPress={signInWithPassword}>
          <Text>Sign In with Password</Text>
        </TouchableOpacity>

        {authenticated && <Text  style={styles.success}>Welcome to my Sam!</Text>}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 200,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    marginBottom: 20,
  },
  success: {
    width: 100,backgroundColor:"green",
    padding: 8,
    borderRadius:10,
    color:"white",
    textAlign : 'center',
    marginTop:10
  },
});

export default Bluetooth;
