<template>
  <v-app dark>

    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="miniVariant"
      color="black"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-tile
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in menuItems"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app clipped-left>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!$currentUser">
        <v-btn flat v-for="(item, i) in toolbarItems" :key="i" :to="item.to">
          <v-icon class="icon-small">{{item.icon}}</v-icon>
        </v-btn>
      </v-toolbar-items>
        <div v-if="$currentUser">
        <v-menu offset-y >
          <v-btn slot="activator" flat>
            <v-icon class="icon-medium">{{'user' | icon}}</v-icon>
            <!-- <v-icon>more_vert</v-icon> -->
            <span class="nested">{{$currentUser.name}}</span>
          </v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in toolbarItems" :key="i" @click="$router.push(item.to)">
              <v-list-tile-action>
                <v-icon v-html="item.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
        </div>
    </v-toolbar>
    <v-content>
      <v-progress-linear v-if="loading" :indeterminate="true" height="2"></v-progress-linear>
      <v-container>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<style>
.progress-linear {
  position: absolute !important;
  margin: 0 !important;
}
</style>

<script>
import UserService from '@/core/UserService'
import ImportService from '@/core/ImportService'

export default {
  created () {
    this.userService = new UserService(this.$firestore)
    this.$firebase.auth().onAuthStateChanged(this.authChanged)
    this.$eventBus.$on('error', this.handleError)
    this.$eventBus.$on('login', this.login)
    this.$eventBus.$on('loading', show => (this.loading = show))

    window.addEventListener('keyup', (e) => {
      if (e.keyCode === 113) {
        this.doImport()
      }
    })
  },
  methods: {
    async authChanged (auth) {
      if (auth) {
        let user = await this.userService.getUserByAuthUid(auth.uid)
        if (user) {
          return this.login(user)
        }
      }
      this.$vuex.commit('logout')
    },
    login (user) {
      return this.$vuex.commit('save', user)
    },
    handleError (err) {
      if (err) console.trace(err)
    },
    async doImport () {
      console.log('yay')
      let importService = new ImportService(this.$firestore)
      await importService.addOperators()
    }
  },
  data () {
    return {
      userService: null,
      drawer: false,
      miniVariant: false,
      loading: false,
      title: 'Rainbow Six Strats'
    }
  },
  computed: {
    menuItems () {
      if (this.$currentUser) {
        return [
          { icon: this.$icons('home'), title: 'Home', to: '/' },
          { icon: this.$icons('search'), title: 'Strategies', to: '/search' },
          { icon: this.$icons('edit'), title: 'New Strategy', to: '/strategy/new' },
          { icon: this.$icons('settings'), title: 'Account', to: '/account' },
          { icon: this.$icons('logout'), title: 'Logout', to: '/logout' }
        ]
      }
      return [
        { icon: this.$icons('search'), title: 'Strategies', to: '/search' },
        { icon: this.$icons('login'), title: 'Login', to: '/login' },
        { icon: this.$icons('register'), title: 'Register', to: '/register' }
      ]
    },
    toolbarItems () {
      if (this.$currentUser) {
        return [
          { icon: this.$icons('settings'), title: 'Account', to: '/account' },
          { icon: this.$icons('logout'), title: 'Logout', to: '/logout' }
        ]
      }
      return [
        { icon: this.$icons('login'), title: 'Login', to: '/login' },
        { icon: this.$icons('register'), title: 'Register', to: '/register' }
      ]
    }
  }
}
</script>
