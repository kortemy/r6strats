<template>
  <div class="tribute input-group input-group--text-field primary--text" ref="input-group">
    <label for="input">{{label}}</label>
    <div class="input-group__input">
      <div class="input" contenteditable="true" @input="update" @tribute-replaced="inserted" @focusin="focus" @focusout="blur" ref="editable">
        {{content}}
      </div>
    </div>
    <div class="input-group__details"><!----></div>
  </div>
</template>

<style scoped>
.input {
  font-size: 16px;
  padding-bottom: 1px;
  box-shadow: none;
  flex: 1;
  min-height: 30px;
  margin: 0;
  display: inline-block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: transparent;
  border-style: none;
  width: 100%;
  color: #fff;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  caret-color: #fb8c00 !important;
}
.input span {
  font-weight: bold;
}
.input:focus {
  border: none;
  outline: none;
}
.inline-tag {
  font-weight: bold;
}
</style>

<script>
export default {
  props: {
    value: String,
    sources: Array,
    label: String,
    required: Boolean
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.value) {
        this.content = this.value
        this.$refs.editable.innerHTML = this.value
      }
      if (this.required) {
        this.addClass('input-group--required')
      }
      if (this.content) {
        this.blur()
      }
      if (process.browser) {
        if (this.tribute) {
          this.tribute.append(0, this.sources, true)
          return
        }
        const Tribute = require('tributejs')
        this.tribute = new Tribute({
          values: this.sources,
          lookup: 'name',
          fillAttr: 'code',
          selectTemplate: function (item) {
            return `<a href="#${item.original.code}">${item.original.name}</a> `
          }
        })
        this.tribute.attach(this.$refs.editable)
      }
    },
    inserted (event) {
      this.update(event)
    },
    update (event) {
      this.$emit('input', this.$refs.editable.innerHTML)
    },
    focus () {
      this.addClass('input-group--focused')
    },
    blur () {
      this.removeClass('input-group--focused')
      if (this.content || this.$refs.editable.innerText) {
        this.addClass('input-group--dirty')
      } else {
        this.removeClass('input-group--dirty')
      }
    },
    addClass (clazz) {
      this.$refs['input-group'].classList.add(clazz)
    },
    removeClass (clazz) {
      this.$refs['input-group'].classList.remove(clazz)
    }
  },
  data () {
    return {
      tribute: null,
      content: null
    }
  },
  watch: {
    sources () {
      this.init()
    },
    value () {
      this.init()
    }
  }
}
</script>