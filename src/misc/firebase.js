import firebase from "firebase/app";
import 'firebase/auth'; 
import 'firebase/database';
import 'firebase/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDs6G3gWQyYV46rNxbiET5LpQoWi4OTgEI",
    authDomain: "chat-web-app-980a1.firebaseapp.com",
    databaseURL: "https://chat-web-app-980a1-default-rtdb.firebaseio.com",
    projectId: "chat-web-app-980a1",
    storageBucket: "chat-web-app-980a1.appspot.com",
    messagingSenderId: "25307697221",
    appId: "1:25307697221:web:628b20b46e1457289e532c"
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const database = app.database();

export const storage = app.storage();
