import firebase from 'firebase'

class UserService {
  constructor (firestore) {
    this.db = {
      users: firestore.collection('users')
    }
  }

  async createUser (name, email, password) {
    let auth = await firebase.auth().createUserWithEmailAndPassword(email, password)
    let ref = await this.db.users.add({})
    let user = {
      id: ref.id,
      uid: auth.user.uid,
      name: name,
      email: email
    }
    await this.db.users.doc(ref.id).set(user)
    return user
  }

  async login (email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password)
  }

  async logout () {
    await firebase.auth().signOut()
  }

  async getUser (id) {
    let user = await this.db.users.doc(id).get()
    return user.data()
  }

  async getUserByAuthUid (uid) {
    let result = await this.db.users.where('uid', '==', uid).get()
    if (result.empty) return null
    return result.docs[0].data()
  }
}

export default UserService
