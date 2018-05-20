import axios from 'axios'

const API_URL = 'http://localhost:3000'

export default {
  async getStaticData () {
    let mapsResponse = await axios.get(`${API_URL}/maps.json`)
    let operatorsResponse = await axios.get(`${API_URL}/operators.json`)

    return {
      modes: [
        { code: 'bomb', name: 'Bomb' },
        { code: 'secure', name: 'Secure Area' },
        { code: 'hostage', name: 'Hostage' }
      ],
      sides: [
        { code: 'attack', name: 'Attack' },
        { code: 'defense', name: 'Defense' }
      ],
      maps: mapsResponse.data,
      operators: operatorsResponse.data
    }
  },

  async getStrats (query) {
    let queryString = Object.keys(query)
      .filter((prop) => {
        let value = query[prop]
        if (Array.isArray(value)) {
          return value.length > 0
        }
        return !!value
      })
      .reduce((bundle, prop) => {
        let value = query[prop]
        if (Array.isArray(value)) {
          value = value.reduce((bundle, val) => {
            return `${bundle}${prop}=${val}&`
          }, '')
          value = value.substring(0, value.length - 1)
          return `${bundle}${value}&`
        }
        return `${bundle}${prop}=${value}&`
      }, '?')

    queryString = queryString.substring(0, queryString.length - 1)

    let response = await axios.get(`${API_URL}/strategies.json${queryString}`)
    return response.data
  },

  async addStrat (strat) {

  },

  async getStrat (code) {
    let response = await axios.get(`${API_URL}/strategy.json`)
    return response.data
  },

  async getMap (code) {
    let response = await axios.get(`${API_URL}/map.json`)
    return response.data
  }
}
