import {ref, set, getDatabase, onValue} from 'firebase/database';
const {app} = require('../FireBaseConfig');

const getUsersPhotos = (getPhotosUserName) => {
  const Ans = [];
  console.log('getUsersPhotosl:',getPhotosUserName);
  const allUserDB = getDatabase(app);
  const allUserPhotosRef = ref(allUserDB, `${getPhotosUserName}photos`);
  onValue(allUserPhotosRef, snapshot => {
    // console.log('Chatjs_snapshot:', snapshot);
    snapshot.forEach(child => {
      Ans.push(child.val());
    });
    // const data = snapshot.val();
    // Handle the retrieved data here
    // console.log('Received data:', users);
  });
  console.log('if inner child.valAns:', Ans.length);
  return Ans;
};
export default getUsersPhotos;
