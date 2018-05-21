import axios from 'axios'

const API_URL = 'http://localhost:8080/static'

class StrategyService {
  constructor (firestore) {
    this.db = {
      modes: firestore.collection('modes'),
      sides: firestore.collection('sides'),
      maps: firestore.collection('maps'),
      operators: firestore.collection('operators'),
      strategies: firestore.collection('strategies')
    }
  }

  async getStaticData () {
    let modes = await this.db.modes.get()
    let sides = await this.db.sides.get()
    let maps = await this.db.maps.get()
    let operators = await this.db.operators.get()

    return {
      modes: modes.docs.map(doc => doc.data()),
      sides: sides.docs.map(doc => doc.data()),
      maps: maps.docs.map(doc => doc.data()),
      operators: operators.docs.map(doc => doc.data())
    }
  }

  async getStrats (query) {
    let dbQuery = this.db.strategies
    Object.keys(query).forEach((prop) => {
      let value = query[prop]
      if (!value) {
        return
      }
      dbQuery = dbQuery.where(prop, '==', value)
    })
    let results = await dbQuery.get()
    return results.docs.map(doc => doc.data())
  }

  async addStrat (strat) {
    // handle on backend
  }

  async getStrat (code) {
    let response = await axios.get(`${API_URL}/strategy.json`)
    return response.data
  }

  async getMap (code) {
    let response = await axios.get(`${API_URL}/map.json`)
    return response.data
  }

  async getOperator (code) {

  }

  async getComments (code) {
    let response = await axios.get(`${API_URL}/comments.json`)
    return response.data
  }

  async likeStrat (user) {
    // handle on backend
  }

  async dislikeStrat (user) {
    // handle on backend
  }
}

export default StrategyService
