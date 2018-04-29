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
                  <v-icon light class="icon-small">{{$icons(strat.mode)}}</v-icon>
                </v-avatar>
                {{$capitalize(strat.mode)}}
              </v-chip>
              <v-chip>
                <v-avatar>
                  <v-icon light class="icon-small">{{$icons(strat.side)}}</v-icon>
                </v-avatar>
                {{$capitalize(strat.side)}}
              </v-chip>
              <v-chip>
                <v-avatar>
                  <v-icon light class="icon-small">{{$icons('map')}}</v-icon>
                </v-avatar>
                {{strat.map.name}}
              </v-chip>
              <v-chip>
                <v-avatar>
                  <v-icon light class="icon-small">{{$icons('objective')}}</v-icon>
                </v-avatar>
                {{strat.objective.name}}
              </v-chip>
              <v-chip class="clickable" @click="userClicked">
                <v-avatar>
                  <v-icon light class="icon-small">{{$icons('user')}}</v-icon>
                </v-avatar>
                {{strat.author.name}}
              </v-chip>
            </div>
            <v-spacer></v-spacer>

            <v-avatar size="36" tile class="clickable" @click="like">
              <v-icon dark class="icon-large" :color="isOwned ? 'info' : isLiked ? 'red' : 'secondary'">{{$icons('like')}}</v-icon>
              <span class="badge accent--text"><strong>{{strat.rating}}</strong></span>
            </v-avatar>
            <v-btn v-if="isOwned" color="primary" @click="$router.push(`/strategy/${strat.code}/edit`)">
              <v-icon dark class="icon-small">{{$icons('edit')}}</v-icon>
              <span class="nested accent--text"><strong>Edit</strong></span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex sm12 md6 fill-height>
        <v-card>
          <v-card-actions>
            <v-avatar>
              <v-icon class="icon-medium">{{$icons('strategy')}}</v-icon>
            </v-avatar>
            <span class="nested"><strong>Strategy details</strong></span>
          </v-card-actions>
          <v-card-text>
            {{strat.details}}
          </v-card-text>
          <v-expansion-panel expand>
            <v-expansion-panel-content v-for="role in strat.operators" :key="role.code">
              <div slot="header">
                <v-avatar size="42" tile>
                  <img :src="`/static/images/ops/${role.code}/badge.png`"/>
                </v-avatar>
                <span class="nested"><strong>{{operatorName(role.code)}} instructions</strong></span>
              </div>
              <v-card>
                <v-card-text>
                  <taggable-text :text="role.role" :sources="map.locations" v-on:hover="focusLocation"></taggable-text>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-flex>
      <v-flex d-flex sm12 md6>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card>
              <interactive-map :map="map" :objective="strat.objective" :focus="locationFocus"></interactive-map>
            </v-card>
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
</style>

<script>
  import StrategyService from '@/core/StrategyService'
  import InteractiveMap from '@/components/InteractiveMap'
  import TaggableText from '@/components/TaggableText'

  const strategyService = new StrategyService()
  export default {
    components: {
      interactiveMap: InteractiveMap,
      taggableText: TaggableText
    },
    async mounted () {
      let strat = await strategyService.getStrat(this.$route.params.code)
      let map = await strategyService.getMap(strat.map.code)
      this.strat = strat
      this.map = map
    },
    methods: {
      operatorName (code) {
        return this.strat.operators.filter(op => (op.code === code))[0].name
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
          await strategyService.likeStrat(this.$currentUser)
          this.$vuex.commit('dislike', this.strat.code)
          return
        }
        await strategyService.dislikeStrat(this.$currentUser)
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
          operators: [],
          details: null,
          rating: 0,
          comments: 0
        },
        map: null,
        locationFocus: null
      }
    },
    computed: {
      isOwned () {
        return this.$currentUser ? this.$currentUser.code === this.strat.author.code : false
      },
      isLiked () {
        return this.$currentUser ? this.$currentUser.likes.indexOf(this.strat.code) !== -1 : false
      }
    }
  }
</script>