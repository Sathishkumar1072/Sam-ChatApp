import {initializeApp, getApp} from 'firebase/app';
import {initializeFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import firebase from 'firebase/app';
import 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: 'your_api_key',
//   authDomain: 'your_auth_domain',
//   projectId: 'your_project_id',
//   storageBucket: 'your_storage_bucket',
//   messagingSenderId: 'your_messaging_sender_id',
//   appId: 'your_app_id',
//   measurementId: 'your_measurement_id' // optional
// };

const firebaseConfig = {
  apiKey: 'AIzaSyCCYMFa7roMt5gZaSUY0TtEhR8-pa_nThs',
  authDomain: 'parha_12.mypackage',
  projectId: 'partha-997aa',
  storageBucket: 'partha-997aa.appspot.com',
  databaseURL: 'https://partha-997aa-default-rtdb.firebaseio.com/',
  messagingSenderId: '988264988811',
  appId: '1:988264988811:android:b0a41f5027915a58e7148e',
  measurementId: 'your_measurement_id', // optional
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = initializeFirestore(app, {experimentalForceLongPolling: true});
export {db, auth,app};
