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

  async getModes () {
    return ['bomb', 'secure', 'hostage']
  }

  async getSides () {
    return ['attack', 'defense']
  }

  async getMaps () {
    let maps = await this.db.maps.get()
    return maps.docs.map(doc => doc.data())
  }

  async getOperators () {
    let operators = await this.db.operators.get()
    return operators.docs.map(doc => doc.data())
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
    let ref = await this.db.strategies.add({})
    strat.code = ref.id
    strat.liked = []
    strat.rating = 0
    strat.comments = 0
    strat.operators = strat.operators.reduce((obj, op) => {
      obj[op.code] = op
      return obj
    }, {})
    await this.db.strategies.doc(ref.id).set(strat)
    return strat
    // handle on backend
  }

  async getStrat (code) {
    let doc = await this.db.strategies.doc(code).get()
    return doc.data()
  }

  async getMap (code) {
    let doc = await this.db.maps.doc(code).get()
    return doc.data()
  }

  async getOperator (code) {
    let doc = await this.db.operators.doc(code).get()
    return doc.data()
  }

  async getComments (code) {
    let result = await this.db.strategies.doc(code).collection('comments').get()
    return result.docs.map(doc => doc.data())
  }

  async likeStrat (user) {
    // handle on backend
  }

  async dislikeStrat (user) {
    // handle on backend
  }
}

export default StrategyService
