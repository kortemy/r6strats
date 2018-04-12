import Vue from 'vue'

let _icons = {
  'strategy': 'fa-compass',
  'attack': 'fa-crosshairs',
  'defense': 'fa-chess-rook',
  'bomb': 'fa-bomb',
  'secure': 'fa-key',
  'hostage': 'fa-user',
  'map': 'fa-map',
  'objective': 'fa-flag',
  'like': 'fa-heart',
  'home': 'fa-home',
  'search': 'fa-search',
  'edit': 'fa-pencil-alt',
  'settings': 'fa-cog',
  'user': 'fa-user',
  'confirm': 'fa-check',
  'cancel': 'fa-times',
  'delete': 'fa-trash',
  'minus': 'fa-minus',
  'plus': 'fa-plus',
  'comment': 'fa-comment',

  'logout': 'fa-sign-out-alt',
  'register': 'fa-user-plus',
  'login': 'fa-sign-in-alt',
  'twitter': 'fa-twitter',
  'facebook': 'fa-facebook',
  'google': 'fa-google'
}

Vue.mixin({
  methods: {
    $capitalize (string) {
      return string ? string.charAt(0).toUpperCase() + string.slice(1) : string
    },
    $rating (rating) {
      return rating > 0 ? '+' + rating : rating
    },
    $icons (code) {
      return _icons[code]
    }
  },
  computed: {
    $currentUser () {
      return this.$vuex.state.user
    }
  }
})
