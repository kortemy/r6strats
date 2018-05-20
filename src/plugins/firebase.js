import Vue from 'vue'
import VueFire from 'vuefire'
import firebase from 'firebase'
import 'firebase/firestore'

Vue.prototype.$firebase = Vue.prototype.$firebase || firebase.initializeApp({
  apiKey: 'AIzaSyBaSVFWBHXSEiurMGfQfWRKZZOchumR_14',
  authDomain: 'siege-strat-book.firebaseapp.com',
  databaseURL: 'https://siege-strat-book.firebaseio.com',
  projectId: 'siege-strat-book',
  storageBucket: 'siege-strat-book.appspot.com',
  messagingSenderId: '729660110077'
})

const firestore = Vue.prototype.$firestore || firebase.firestore()
const settings = { timestampsInSnapshots: true }
firestore.settings(settings)

Vue.prototype.$firestore = firestore

Vue.use(VueFire)
