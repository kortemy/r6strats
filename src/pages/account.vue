<template>
  <div>
    {{JSON.stringify(user)}}
  </div>
</template>

<script>
export default {
  computed: {
    user () {
      return this.$vuex.state.user
    }
  }
}
</script>
