<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <!-- Strat details --> 
      <v-flex d-flex xs12>
        <v-card class="">
          <v-card-actions>
            <div class="nested">
              <v-chip>
                <v-avatar>
                  <v-icon light class="icon-small">{{strat.mode | icon}}</v-icon>
                </v-avatar>
                {{strat.mode | capitalize}}
              </v-chip>
              <v-chip>
                <v-avatar>
                  <v-icon light class="icon-small">{{strat.side | icon}}</v-icon>
                </v-avatar>
                {{strat.side | capitalize}}
              </v-chip>
              <v-chip>
                <v-avatar>
                  <v-icon light class="icon-small">{{'map' | icon}}</v-icon>
                </v-avatar>
                {{strat.map.name}}
              </v-chip>
              <v-chip>
                <v-avatar>
                  <v-icon light class="icon-small">{{'objective' | icon}}</v-icon>
                </v-avatar>
                {{strat.objective.name}}
              </v-chip>
              <v-chip class="clickable" @click="userClicked">
                <v-avatar>
                  <v-icon light class="icon-small">{{'user' | icon}}</v-icon>
                </v-avatar>
                {{strat.author.name}}
              </v-chip>
            </div>
            <v-spacer></v-spacer>

            <v-avatar size="36" tile class="clickable" @click="like">
              <v-icon dark class="icon-large" :color="isOwned ? 'info' : isLiked ? 'red' : 'secondary'">{{'like' | icon}}</v-icon>
              <span class="badge accent--text"><strong>{{strat.rating}}</strong></span>
            </v-avatar>
            <v-btn v-if="isOwned" color="primary" @click="$router.push(`/strategy/${strat.code}/edit`)">
              <v-icon dark class="icon-small">{{'edit' | icon}}</v-icon>
              <span class="nested accent--text"><strong>Edit</strong></span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex sm12 md6 fill-height>
        <v-card>
          <v-card-actions>
            <v-avatar>
              <v-icon class="icon-medium">{{'strategy' | icon}}</v-icon>
            </v-avatar>
            <span class="nested"><strong>Strategy details</strong></span>
          </v-card-actions>
          <v-card-text>
            <taggable-text :text="strat.details" :sources="taggableSources" v-on:focus="focusLocation"></taggable-text>
          </v-card-text>
          <v-expansion-panel expand>
            <v-expansion-panel-content v-for="role in operators" :key="role.code">
              <div slot="header">
                <v-avatar size="42" tile>
                  <img :src="`/static/images/ops/${role.code}/badge.png`"/>
                </v-avatar>
                <span class="nested"><strong>{{operatorName(role.code)}} instructions</strong></span>
              </div>
              <v-card>
                <v-card-text>
                  <taggable-text :text="role.role" :sources="taggableSources" v-on:focus="focusLocation"></taggable-text>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>

        <v-card class="comments-box">
          <v-expansion-panel expand>
            <v-expansion-panel-content>
              <div slot="header" class="nested-header card__actions">
                <v-avatar>
                  <v-icon class="icon-medium">{{'comment' | icon}}</v-icon>
                </v-avatar>
                <span class="nested"><strong>Comments ({{comments.length}})</strong></span>
              </div>
              <comment-section :comments="comments" :sources="taggableSources" @focus="focusLocation"></comment-section>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-flex>
      <v-flex d-flex sm12 md6>
        <v-layout row wrap>
          <v-flex xs12>
            <interactive-map :map="map" :objective="strat.objective" :focus="locationFocus"></interactive-map>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped>
.badge {
  position: absolute;
  font-size: 12px;
}
.comments-box {
  margin-top: 8px;
}
.nested-header {
  margin: -12px -24px;
}
</style>

<script>
  import StrategyService from '@/core/StrategyService'
  import InteractiveMap from '@/components/InteractiveMap'
  import TaggableText from '@/components/TaggableText'
  import CommentSection from '@/components/CommentSection'

  export default {
    components: {
      interactiveMap: InteractiveMap,
      taggableText: TaggableText,
      commentSection: CommentSection
    },
    async created () {
      this.strategyService = new StrategyService(this.$firestore)
      this.strat = await this.strategyService.getStrat(this.$route.params.code)
      this.map = await this.strategyService.getMap(this.strat.map.code)
      this.comments = await this.strategyService.getComments(this.strat.code)
      this.operators = Object.values(this.strat.operators)
    },
    methods: {
      operatorName (code) {
        return this.operators.filter(op => (op.code === code))[0].name
      },
      locationName (code) {
        return this.map.locations.filter(loc => (loc.code === code))[0].name
      },
      focusLocation (code) {
        this.locationFocus = code
      },
      userClicked () {
        this.$router.push(`/users/${this.strat.author.code}`)
      },
      async like () {
        if (this.isOwned) {
          return
        }
        if (this.isLiked) {
          await this.strategyService.likeStrat(this.$currentUser)
          this.$vuex.commit('dislike', this.strat.code)
          return
        }
        await this.strategyService.dislikeStrat(this.$currentUser)
        this.$vuex.commit('like', this.strat.code)
      }
    },
    data () {
      return {
        strat: {
          code: null,
          side: null,
          mode: null,
          author: {},
          map: {},
          objective: {},
          details: null,
          rating: 0
        },
        operators: [],
        comments: [],
        map: null,
        locationFocus: null
      }
    },
    computed: {
      taggableSources () {
        return this.map ? this.map.locations : []
      },
      isOwned () {
        return this.$currentUser ? this.$currentUser.code === this.strat.author.code : false
      },
      isLiked () {
        return this.$currentUser ? this.$currentUser.likes.indexOf(this.strat.code) !== -1 : false
      }
    }
  }
</script>