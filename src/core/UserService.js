import firebase from 'firebase'
import axios from 'axios'

const API_URL = 'http://localhost:8080/static'

class UserService {
  async createUser (name, email, password) {
    let auth = await firebase.auth().createUserWithEmailAndPassword(email, password)
    await auth.updateProfile({
      displayName: name
    })
    return auth
  }

  async login (email, password) {
    let auth = await firebase.auth().signInWithEmailAndPassword(email, password)
    // handle on backend
    return auth
  }

  async logout () {
    await firebase.auth().signOut()
  }

  async getUser (token) {
    let user = await axios.get(`${API_URL}/user.json?token=${token}`)
    return user.data
  }
}

export default UserService
