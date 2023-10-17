import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase/app';
import database from 'firebase/database';

const UserDataList = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Reference to the users node in your Firebase Realtime Database
    const usersRef = firebase.database().ref('chats');

    // Listen for changes to the users node
    usersRef.on('value', (snapshot) => {
      // Convert the Firebase snapshot to an array of user data
      const users = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        users.push(user);
      });

      // Update the state with the user data
      setUserData(users);
    });

    // Clean up the listener when the component unmounts
    return () => {
      usersRef.off('value');
    };
  }, []);

  return (
    <View>
      {userData.map((user, index) => (
        <Text key={index}>{user.name} - {user.email}</Text>
      ))}
    </View>
  );
};

export default UserDataList;
