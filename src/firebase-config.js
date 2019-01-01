//import firebase from 'firebase';
import * as firebase from 'firebase'

const config = {
    apiKey: 'AIzaSyDsxTsf_KCxsgiJC4dQpQlsM9gf7cvy5aE',
    authDomain: 'jayla-tickets.firebaseapp.com',
    databaseURL: 'https://jayla-tickets.firebaseio.com',
    projectId: 'jayla-tickets',
    storageBucket: 'jayla-tickets.appspot.com',
    messagingSenderId: '873814667748'
  };

let  firebaseapp = firebase.initializeApp(config)
export default firebase
export const db = firebaseapp.database()
