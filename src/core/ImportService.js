// import axios from 'axios'

class ImportService {
  constructor (firestore) {
    this.db = {
      db: firestore,
      maps: firestore.collection('maps'),
      operators: firestore.collection('operators')
    }
  }

  async addMaps () {

  }

  async addOperators () {
    // let batchDelete = this.db.db.batch()

    // let operators = await this.db.operators.get()
    // operators.docs.forEach(doc => {
    //   batchDelete.delete(doc.ref)
    // })

    // await batchDelete.commit()

    // let batchInsert = this.db.db.batch()

    // let response = await axios.get('/static/operators.json')
    // response.data.forEach(doc => {
    //   let ref = this.db.operators.doc(doc.code)
    //   batchInsert.set(ref, doc)
    // })

    // await batchInsert.commit()
  }
}

export default ImportService
