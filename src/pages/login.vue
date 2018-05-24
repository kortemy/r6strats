<template>
  <v-container class="wrapper">
    <v-card>
      <v-card-title>
        <v-avatar>
          <v-icon class="icon-medium">{{'login' | icon}}</v-icon>
        </v-avatar>
        <strong>Sign in</strong>
      </v-card-title>
      <!-- <v-card-text>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12 sm4>
              <v-btn 
                block
                color="blue">
                <i :class="`fab ${'twitter' | icon}`"></i>
              </v-btn>
            </v-flex>
            <v-flex xs12 sm4>
              <v-btn 
                block
                color="blue darken-3">
                <i :class="`fab ${'facebook' | icon}`"></i>
              </v-btn>
            </v-flex>
            <v-flex xs12 sm4>
              <v-btn 
                block
                color="red darken-1">
                <i :class="`fab ${'google' | icon}`"></i>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text> -->
      <v-card-text>
        <v-text-field
          v-model="email"
          label="Email">
        </v-text-field>
        <v-text-field
          type="password"
          v-model="password"
          label="Password">
        </v-text-field>
        <div class="red--text" v-if="message">
          {{message}}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          flat>
          Reset password
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          @click="doLogin"
          color="primary">
          <v-icon class="icon-small">{{'login' | icon}}</v-icon>
          <span class="nested">Sign in</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<style scoped>
.wrapper {
  max-width: 560px !important;
}
</style>

<script>
import UserService from '@/core/UserService'

export default {
  created () {
    this.userService = new UserService(this.$firestore)
  },
  methods: {
    async doLogin () {
      this.$eventBus.$emit('loading', true)
      this.message = null
      try {
        await this.userService.login(this.email, this.password)
        this.$eventBus.$emit('loading', false)
        this.$router.push('/')
      } catch (err) {
        this.message = this.validation[err.code] || 'Unknown error, please reload and try again.'
        this.$eventBus.$emit('loading', false)
      }
    }
  },
  data () {
    return {
      email: null,
      password: null,
      userService: null,
      message: null,
      validation: {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-not-found': 'Incorrect email address or password',
        'auth/wrong-password': 'Incorrect email address or password'
      }
    }
  }
}
</script>
