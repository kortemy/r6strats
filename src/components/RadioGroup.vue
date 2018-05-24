<template>
  <v-container class="wrapper">
    <v-layout column>
      <v-flex v-for="op in options" :key="op" class="clickable" xs12 @click="select(op)">
        <v-icon :class="`icon-medium ${getClass(op)}`">{{op | icon}}</v-icon>
        <span :class="`nested ${getClass(op)}`">{{op | capitalize}}</span>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped>
.wrapper {
  padding: 8px;
}
.clickable .icon {
  margin: 0 8px;
  width: 24px;
}
</style>

<script>
export default {
  props: {
    options: Array
  },
  data () {
    return {
      selected: this.options.length > 0 ? this.options[0] : null
    }
  },
  methods: {
    select (option) {
      this.selected = option
      this.$emit('input', option)
    },
    getClass (option) {
      return this.selected === option ? 'primary--text' : ''
    }
  },
  watch: {
    options () {
      this.selected = this.selected || this.options.length > 0 ? this.options[0] : null
    }
  }
}
</script>