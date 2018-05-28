<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <!-- Strat details --> 
      <v-flex xs12>
        <v-card>
          <v-card-actions>
            <v-avatar>
              <v-icon class="icon-medium">{{'edit' | icon}}</v-icon>
            </v-avatar>
            <span class="nested"><strong>New Strategy</strong></span>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="save">
              <v-icon class="icon-small">{{'confirm' | icon}}</v-icon>
              <span class="nested">Save</span>
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
          <v-layout column wrap mx-3>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <radio-group v-model="selected.mode" :options="modes" label="Game mode"></radio-group>
                </v-flex>
                <v-flex xs12 sm6>
                  <radio-group v-model="selected.side" :options="sides" label="Side"></radio-group>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-select
                    label="Map"
                    :items="maps"
                    v-model="selected.map"
                    item-text="name"
                    item-value="code"
                    return-object
                    clearable
                    autocomplete
                    chips
                    bottom
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs6>
                  <v-select
                    label="Objective"
                    :items="objectives"
                    v-model="selected.objective"
                    item-text="name"
                    item-value="code"
                    return-object
                    clearable
                    chips
                    bottom
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    label="Operators"
                    :items="filteredOperators"
                    v-model="selected.operators"
                    item-text="name"
                    item-value="code"
                    clearable
                    return-object
                    multiple
                    chips
                    autocomplete
                    required
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-card-text>
            <taggable-input 
              label="General instructions"
              v-model="selected.details"
              :sources="locations"
              required
              ></taggable-input>
            <template v-for="op in selected.operators">
              <taggable-input 
                :key="op.name"
                :label="`${op.name} instructions`"
                v-model="op.role"
                :sources="locations"
                required
                ></taggable-input>
            </template>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex sm12 md6>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card>
              <interactive-map :map="selected.map" :objective="selected.objective.code"></interactive-map>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped>
.wrapper {
  max-width: 800px !important;
  padding: 0;
}
</style>

<script>
  import StrategyService from '@/core/StrategyService'
  import StratCard from '@/components/StratCard'
  import TaggableInput from '@/components/TaggableInput'
  import InteractiveMap from '@/components/InteractiveMap'
  import RadioGroup from '@/components/RadioGroup'

  export default {
    components: {
      stratCard: StratCard,
      taggableInput: TaggableInput,
      radioGroup: RadioGroup,
      interactiveMap: InteractiveMap
    },
    async created () {
      if (!this.$currentUser) {
        this.$router.push('/search')
        return
      }
      this.$eventBus.$emit('loading', true)
      this.strategyService = new StrategyService(this.$firestore)
      this.modes = await this.strategyService.getModes()
      this.sides = await this.strategyService.getSides()
      this.maps = await this.strategyService.getMaps()
      this.operators = await this.strategyService.getOperators()
      this.$eventBus.$emit('loading', false)
    },
    methods: {
      async save () {
        try {
          let strategy = await this.strategyService.addStrat(this.payload)
          this.$router.push('/strategy/' + strategy.code)
        } catch (e) {

        }
      }
    },
    data () {
      return {
        strategyService: null,
        valid: false,
        selected: {
          side: 'attack',
          mode: 'bomb',
          map: null,
          objective: {},
          operators: [],
          details: null
        },
        modes: [],
        sides: [],
        maps: [],
        operators: []
      }
    },
    computed: {
      payload () {
        return {
          author: { id: this.$currentUser.id, name: this.$currentUser.name },
          side: this.selected.side,
          mode: this.selected.mode,
          map: this.selected.map && { code: this.selected.map.code, name: this.selected.map.name },
          objective: { code: this.selected.objective.code, name: this.selected.objective.name },
          operators: this.selected.operators,
          details: this.selected.details
        }
      },
      filteredOperators () {
        return this.operators.filter(op => op.side === this.selected.side || op.side === 'both')
      },
      locations () {
        return this.selected.map ? this.selected.map.locations : []
      },
      objectives () {
        return this.selected.map ? this.selected.map.objectives.filter(ob => ob.modes.indexOf(this.selected.mode) > -1) : []
      }
    },
    watch: {
      payload () {
        // console.log(this.payload)
      }
    }
  }
</script>