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

            <v-avatar size="36" tile class="clickable">
              <v-icon dark class="icon-large" :color="isOwned ? 'info' : isLiked ? 'red' : 'secondary'">{{'like' | icon}}</v-icon>
              <span class="badge accent--text"><strong>{{strat.rating}}</strong></span>
            </v-avatar>
            <v-btn v-if="isOwned" color="primary" @click="save">
              <v-icon dark class="icon-small">{{'edit' | icon}}</v-icon>
              <span class="nested accent--text"><strong>Save</strong></span>
            </v-btn>
            <v-btn v-if="isOwned" color="error" @click="remove">
              <v-icon dark class="icon-small">{{'delete' | icon}}</v-icon>
              <span class="nested accent--text"><strong>Delete</strong></span>
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
            {{strat.details}}
          </v-card-text>
          <v-card-text>
            <v-select
              label="Operators"
              :items="filteredOperators"
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
            <span class="nested"><strong>{{role.name}} instructions</strong></span>
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
      if (!this.isOwned) {
        this.$router.push('/')
      }
      this.$eventBus.$emit('loading', true)
      this.strategyService = new StrategyService(this.$firestore)
      this.modes = await this.strategyService.getModes()
      this.sides = await this.strategyService.getSides()
      this.operators = await this.strategyService.getOperators()
      this.strat = await this.strategyService.getStrat(this.$route.params.code)
      this.map = await this.strategyService.getMap(this.strat.map.code)
      this.$eventBus.$emit('loading', false)
    },
    methods: {
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
        operators: [],
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
      },
      filteredOperators () {
        return this.operators.filter(op => op.side === this.strat.side || op.side === 'both')
      }
    }
  }
</script>