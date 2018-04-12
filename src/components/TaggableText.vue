<template>
  <span>
    <template v-for="c in chunks" >
      <span :key="c.value" >
        <span v-if="c.tag" v-on:click="hover(c.tag)" class="tag"><strong>{{c.value}}</strong></span>
        <span v-else>{{c.value}}</span>
      </span>
    </template>
  </span>
</template>

<style scoped>
  .tag {
    cursor: pointer !important;
  }
</style>

<script>
import mentions from 'mention-parser'
export default {
  props: ['text', 'sources'],
  methods: {
    hover (tag) {
      this.$emit('hover', tag)
    },
    value (code) {
      let source = this.sources.filter(source => source.code === code)[0]
      return source ? source.name : ''
    }
  },
  computed: {
    chunks () {
      if (!this.text) {
        return []
      }
      let tags = mentions(this.text).get()
      let start = 0
      let chunks = []
      tags.forEach(tag => {
        let end = this.text.indexOf(tag)
        let chunk = this.text.substring(start, end)
        chunks.push({
          value: chunk
        })
        let code = tag.replace('@', '')
        chunks.push({
          tag: code,
          value: this.value(code)
        })
        start = end + tag.length
      })
      let lastChunk = this.text.substring(start, this.text.length)
      chunks.push({
        value: lastChunk
      })
      return chunks
    }
  }
}
</script>