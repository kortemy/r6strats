<template>
  <span>
    <template v-for="c in chunks" >
      <span :key="c.value" >
        <a v-if="c.tag" v-on:click="focus(c.tag)" class="tag"><strong>{{c.value}}</strong></a>
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
  mounted () {
    // console.log(this.text)
  },
  methods: {
    focus (tag) {
      this.$emit('focus', tag)
    },
    value (code) {
      let source = this.sources.filter(source => source.code === code)[0]
      return source ? source.name : code
    }
  },
  computed: {
    chunks () {
      if (!this.text) {
        return []
      }

      let parser = new DOMParser()
      let data = parser.parseFromString(this.text, 'text/html')
      let body = data.querySelector('body')

      data.querySelectorAll('a').forEach(m => {
        let tag = m.getAttribute('href')
        if (tag) {
          m.innerText = '@' + tag.slice(1)
        }
      })

      let text = body.innerText
      let chunks = []
      let tags = mentions(text).get()
      let start = 0
      tags.forEach(tag => {
        let end = text.indexOf(tag)
        let chunk = text.substring(start, end)
        chunks.push({
          value: chunk
        })
        let code = tag.replace('@', '')
        let value = this.value(code)
        chunks.push({
          tag: code,
          value: value
        })
        start = end + tag.length
      })
      let lastChunk = text.substring(start, text.length)
      chunks.push({
        value: lastChunk
      })
      console.log(chunks)
      return chunks
    }
  }
}
</script>