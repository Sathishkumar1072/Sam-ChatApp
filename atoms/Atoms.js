import {atom} from 'recoil';

export const showLoading = atom({
  key: 'showLoading',
  default: false,
});
export const photoURL = atom({
  key: 'photoURL',
  default: [],
});
