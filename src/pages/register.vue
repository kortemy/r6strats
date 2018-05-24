<template>
  <v-container class="wrapper">
    <v-card>
      <v-card-title>
        <v-avatar>
          <v-icon class="icon-medium">{{'register' | icon}}</v-icon>
        </v-avatar>
        <strong>Create an account</strong>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          label="Name">
        </v-text-field>
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
        <v-spacer></v-spacer>
        <v-btn
          @click="doRegister"
          color="primary">
          <v-icon class="icon-small">{{'register' | icon}}</v-icon>
          <span class="nested">Submit</span>
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
    async doRegister () {
      this.$eventBus.$emit('loading', true)
      try {
        let user = await this.userService.createUser(this.name, this.email, this.password)
        this.$eventBus.$emit('login', user)
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
      name: null,
      email: null,
      password: null,
      userService: null,
      message: null,
      validation: {
        'auth/invalid-email': 'Invalid email address',
        'auth/auth/email-already-in-use': 'Email address is already taken'
      }
    }
  }
}
</script>
