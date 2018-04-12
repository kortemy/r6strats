<template>
  <v-container class="wrapper">
    <v-layout column>
      <v-flex v-for="op in options" :key="op.code" class="clickable" xs12 @click="select(op)">
        <v-icon :class="`icon-medium ${getClass(op)}`">{{$icons(op.code)}}</v-icon>
        <span :class="`nested ${getClass(op)}`">{{op.name}}</span>
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
      selected: this.options.length > 0 ? this.options[0].code : null
    }
  },
  methods: {
    select (option) {
      this.selected = option.code
      this.$emit('input', option)
    },
    getClass (option) {
      return this.selected === option.code ? 'primary--text' : ''
    }
  }
}
</script>