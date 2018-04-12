<template>
  <v-container class="wrapper">
    <v-card>
      <v-card-title>
        <v-avatar>
          <v-icon class="icon-medium">{{$icons('register')}}</v-icon>
        </v-avatar>
        <strong>Create an account</strong>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="username"
          label="Username">
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
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="doRegister"
          color="primary">
          <v-icon class="icon-small">{{$icons('register')}}</v-icon>
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
    this.userService = new UserService()
  },
  methods: {
    async doRegister () {
      this.$eventBus.$emit('loading', true)
      try {
        await this.userService.createUser(this.username, this.email, this.password)
        this.$eventBus.$emit('loading', false)
        this.$router.push('/')
      } catch (err) {
        console.log(err)
      }
    }
  },
  data () {
    return {
      username: null,
      email: null,
      password: null,
      userService: null
    }
  }
}
</script>
