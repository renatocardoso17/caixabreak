import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import App from './App';
import * as serviceWorker from './serviceWorker';

import './index.css';

const firebaseConfig = {
    apiKey: "AIzaSyAFZFduhEa0DV1Ra1OauMUjkimbw0NzmQ4",
    authDomain: "caixabreak.firebaseapp.com",
    databaseURL: "https://caixabreak.firebaseio.com",
    projectId: "caixabreak",
    storageBucket: "caixabreak.appspot.com",
    messagingSenderId: "708860926883",
    appId: "1:708860926883:web:75030dc4ceae940fe55816",
    measurementId: "G-GZ8QWTQCZK"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
