import firebase from 'firebase'

class UserService {
  constructor (firestore) {
    this.db = firestore.collection('users')
  }

  async createUser (name, email, password) {
    let auth = await firebase.auth().createUserWithEmailAndPassword(email, password)
    let ref = await this.db.add({})
    let user = {
      id: ref.id,
      uid: auth.user.uid,
      name: name,
      email: email,
      likes: []
    }
    await this.db.doc(ref.id).set(user)
    return user
  }

  async login (email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password)
  }

  async logout () {
    await firebase.auth().signOut()
  }

  async getUser (id) {
    return this.db.doc(id)
  }

  async getUserByAuthUid (uid) {
    let result = await this.db.where('uid', '==', uid).get()
    if (result.empty) return null
    return result.docs[0].data()
  }
}

export default UserService
