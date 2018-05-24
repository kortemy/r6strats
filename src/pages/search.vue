<template>
  <v-container grid-list-md>
    <v-card dark tile>
      <v-card-actions>
        <v-avatar>
          <v-icon class="icon-medium">{{'search' | icon}}</v-icon>
        </v-avatar>
        <span class="card-title"><strong>Find Strategies</strong></span>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="load">
          <v-icon class="">{{'confirm' | icon}}</v-icon>
          <span class="nested">Apply</span>
        </v-btn>
      </v-card-actions>
      <v-layout wrap mx-3>
        <v-flex xs12 sm6 md3 lg2>
          <radio-group v-model="selected.mode" :options="modes" label="Game mode"></radio-group>
        </v-flex>
        <v-flex xs12 sm6 md3 lg2>
          <radio-group v-model="selected.side" :options="sides" label="Side"></radio-group>
        </v-flex>
        <v-flex xs12 sm12 md6 lg8>
          <v-layout wrap>
            <v-flex fluid xs12 sm12 md6>
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
              ></v-select>
            </v-flex>
            <v-flex xs12 sm12 md6>
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
              ></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12>
              <v-select
                label="With operators"
                :items="filteredOperators"
                v-model="selected.operators"
                item-text="name"
                item-value="code"
                clearable
                return-object
                multiple
                chips
                autocomplete
              ></v-select>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
    <v-container class="list-wrapper">
      <v-layout row wrap>
        <v-flex xs12 md6 lg4 v-for="strat in result" :key="strat.id">
          <strat-card :strat="strat"/>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-if="result.length === 0">
        <v-flex xs12>
          No strategies match that criteria. <span class="link" @click="$router.push('/strategy/new')">Maybe create one?</span>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<style scoped>
.list-wrapper {
  padding: 14px 0;
}
</style>

<script>
  import StrategyService from '@/core/StrategyService'
  import StratCard from '@/components/StratCard'
  import RadioGroup from '@/components/RadioGroup'

  export default {
    components: {
      stratCard: StratCard,
      radioGroup: RadioGroup
    },
    async created () {
      this.$eventBus.$emit('loading', true)
      this.strategyService = new StrategyService(this.$firestore)
      this.modes = await this.strategyService.getModes()
      this.sides = await this.strategyService.getSides()
      this.maps = await this.strategyService.getMaps()
      this.operators = await this.strategyService.getOperators()
      this.load()
    },
    methods: {
      async load () {
        try {
          this.$eventBus.$emit('loading', true)
          let result = await this.strategyService.getStrats(this.query)
          this.result = result || []
          this.$eventBus.$emit('loading', false)
        } catch (err) { this.error = err }
      }
    },
    data () {
      return {
        strategyService: null,
        selected: {
          side: 'attack',
          mode: 'bomb',
          map: null,
          objective: null,
          operators: []
        },
        sides: [],
        modes: [],
        maps: [],
        operators: [],
        error: null,
        result: []
      }
    },
    computed: {
      query () {
        let query = {
          side: this.selected.side,
          mode: this.selected.mode,
          'map.code': this.selected.map ? this.selected.map.code : null,
          'objective.code': this.selected.objective
        }
        this.selected.operators.forEach(op => {
          query[`operators.${op.code}.code`] = op.code
        })
        return query
      },
      filteredOperators () {
        return this.operators.filter(op => op.side === this.selected.side)
      },
      objectives () {
        return this.selected.map ? this.selected.map.objectives.filter(ob => ob.modes.indexOf(this.selected.mode) > -1) : []
      }
    },
    watch: {
      'selected.map' () {
        this.selected.objective = null
      },
      error (err) {
        this.$eventBus.$emit('loading', false)
        this.$emit('error', err)
      }
    }
  }
</script>