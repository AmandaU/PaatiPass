import * as firebase from 'firebase'
import * as config from './config';

let  firebaseapp = firebase.initializeApp(config.config)
export default firebase
export const db = firebaseapp.database()
