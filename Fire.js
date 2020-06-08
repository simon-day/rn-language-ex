import * as firebase from 'firebase';
import 'firebase/firestore';
import FirebaseKeys from './config';

const app = firebase.initializeApp(FirebaseKeys);
export const db = firebase.firestore(app);
