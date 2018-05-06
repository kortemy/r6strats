<template>
  <v-card>
    <v-card-actions class="nested">
      <taggable-input
        label="Add new comment"
        v-model="newCommentText"
        :sources="sources"
        required
        ></taggable-input>
      <v-btn color="primary">
        <v-icon>{{$icons('confirm')}}</v-icon>
        <span class="nested accent--text"><strong>Add</strong></span>
      </v-btn>
    </v-card-actions>
    <div class="nested" v-for="comment in sortedComments" :key="comment.code">
      <v-card-actions>
        <v-chip class="clickable" @click="userClicked(comment.author)">
          <v-avatar>
            <v-icon light class="icon-small">{{$icons('user')}}</v-icon>
          </v-avatar>
          {{comment.author.name}}
        </v-chip>
        <v-spacer></v-spacer>
        <span class="grey--text">
          <i>{{ comment.timestamp | moment('MMM Do YYYY') }}</i>
        </span>
      </v-card-actions>
      <v-card-text>
        <taggable-text :text="comment.text" :sources="sources" v-on:focus="focusLocation"></taggable-text>
        {{comment.text}}
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
import TaggableText from '@/components/TaggableText'
import TaggableInput from '@/components/TaggableInput'
export default {
  props: ['comments', 'sources'],
  components: {
    taggableText: TaggableText,
    taggableInput: TaggableInput
  },
  methods: {
    userClicked (user) {

    },
    focusLocation (code) {
      this.$emit('focus', code)
    }
  },
  data () {
    return {
      newCommentText: null
    }
  },
  computed: {
    sortedComments () {
      return this.comments.sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1
        if (a.timestamp < b.timestamp) return 1
        return 0
      })
    }
  }
}
</script>
