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

            <v-avatar size="36" tile class="clickable">
              <v-icon dark class="icon-large" :color="isOwned ? 'info' : isLiked ? 'red' : 'secondary'">{{$icons('like')}}</v-icon>
              <span class="badge accent--text"><strong>{{strat.rating}}</strong></span>
            </v-avatar>
            <v-btn v-if="isOwned" color="primary" @click="save">
              <v-icon dark class="icon-small">{{$icons('edit')}}</v-icon>
              <span class="nested accent--text"><strong>Save</strong></span>
            </v-btn>
            <v-btn v-if="isOwned" color="error" @click="remove">
              <v-icon dark class="icon-small">{{$icons('delete')}}</v-icon>
              <span class="nested accent--text"><strong>Delete</strong></span>
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
          <v-card-text>
            <v-select
              label="Operators"
              :items="operators"
              v-model="strat.operators"
              item-text="name"
              item-value="code"
              clearable
              return-object
              multiple
              chips
              autocomplete
              required
            ></v-select>
          </v-card-text>
          <v-card-text v-for="role in strat.operators" :key="role.code">
            <v-avatar size="42" tile>
              <img :src="`/static/images/ops/${role.code}/badge.png`"/>
            </v-avatar>
            <span class="nested"><strong>{{operatorName(role.code)}} instructions</strong></span>
            <taggable-input 
              :key="role.code"
              :label="`${role.name} instructions`"
              v-model="role.role"
              :sources="map.locations"
              required
              ></taggable-input>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex sm12 md6>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card>
              <interactive-map :map="map" :focus="locationFocus"></interactive-map>
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
  import TaggableInput from '@/components/TaggableInput'

  export default {
    components: {
      interactiveMap: InteractiveMap,
      taggableInput: TaggableInput
    },
    async created () {
      this.strategyService = new StrategyService(this.$firestore)
      this.data = await this.strategyService.getStaticData()
      this.strat = await this.strategyService.getStrat(this.$route.params.code)
      this.map = await this.strategyService.getMap(this.strat.map.code)
      if (!this.isOwned) {
        this.$router.push('/')
      }
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
      save () {

      },
      remove () {

      }
    },
    data () {
      return {
        strategyService: null,
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
        locationFocus: null,
        data: null
      }
    },
    computed: {
      isOwned () {
        return this.$currentUser ? this.$currentUser.code === this.strat.author.code : false
      },
      isLiked () {
        return this.$currentUser ? this.$currentUser.likes.indexOf(this.strat.code) !== -1 : false
      },
      operators () {
        return this.data ? this.data.operators.filter(op => op.side === this.strat.side) : []
      }
    }
  }
</script>