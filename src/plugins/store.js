import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: null,
    user: null
  },
  mutations: {
    token (state, value) {
      state.token = value
    },
    save (state, value) {
      console.log(value)
      if (!value.likes) value.likes = []
      state.user = value
    },
    like (state, value) {
      let index = state.user.likes.indexOf(value)
      if (index !== -1) return
      state.user.likes.push(value)
    },
    dislike (state, value) {
      let index = state.user.likes.indexOf(value)
      if (index === -1) return
      state.user.likes.splice(index, 1)
    },
    logout (state) {
      state.token = null
      state.user = null
    }
  },
  // ...
  plugins: [createPersistedState()]
})

Vue.mixin({
  computed: {
    $vuex () {
      return store
    }
  }
})

export default store
