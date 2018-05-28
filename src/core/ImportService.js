import axios from 'axios'

class ImportService {
  constructor (firestore) {
    console.log(axios)
    this.db = {
      db: firestore,
      maps: firestore.collection('maps'),
      operators: firestore.collection('operators')
    }
  }

  async addMaps () {
    let batchInsert = this.db.db.batch()

    let bank = await axios.get('/static/bank.json')
    batchInsert.set(this.db.maps.doc('bank'), bank.data)
    let bartlett = await axios.get('/static/bartlett.json')
    batchInsert.set(this.db.maps.doc('bartlett'), bartlett.data)

    await batchInsert.commit()
  }

  async addOperators () {
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
