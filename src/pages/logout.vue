<template>
</template>

<script>
import UserService from '@/core/UserService'

export default {
  created () {
    const userService = new UserService(this.$firestore)
    userService.logout()
    this.$router.push('/')
  }
}
</script>
