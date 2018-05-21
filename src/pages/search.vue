<template>
  <v-container grid-list-md>
    <v-card dark tile>
      <v-card-actions>
        <v-avatar>
          <v-icon class="icon-medium">{{$icons('search')}}</v-icon>
        </v-avatar>
        <span class="card-title"><strong>Find Strategies</strong></span>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="load">
          <v-icon class="">{{$icons('confirm')}}</v-icon>
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
                :items="operators"
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
      this.strategyService = new StrategyService(this.$firestore)
      this.data = await this.strategyService.getStaticData()
      this.selected.side = this.data.sides[0]
      this.selected.mode = this.data.modes[0]
      console.log(this.selected)
      this.load()
    },
    methods: {
      async load () {
        try {
          let result = await this.strategyService.getStrats(this.query)
          this.result = result || []
        } catch (err) { this.error = err }
      }
    },
    data () {
      return {
        strategyService: null,
        selected: {
          side: {},
          mode: {},
          map: null,
          objective: null,
          operators: []
        },
        data: {},
        error: null,
        result: []
      }
    },
    computed: {
      query () {
        let query = {
          side: this.selected.side.code,
          mode: this.selected.mode.code,
          'map.code': this.selected.map ? this.selected.map.code : null,
          'objective.code': this.selected.objective
        }
        this.selected.operators.forEach(op => {
          query[`operators.${op.code}.code`] = op.code
        })
        return query
      },
      modes () {
        return this.data.modes || []
      },
      sides () {
        return this.data.sides || []
      },
      maps () {
        return this.data.maps || []
      },
      operators () {
        return this.data.operators ? this.data.operators.filter(op => op.side === this.selected.side.code) : []
      },
      objectives () {
        return this.selected.map ? this.selected.map.objectives.filter(ob => ob.modes.indexOf(this.selected.mode.code) > -1) : []
      },
      strings () {
        return {
          side: this.selected.side.name,
          mode: this.selected.mode.name,
          map: this.selected.map ? this.selected.map.name : 'any map',
          objective: this.selected.objective ? `(${this.selected.objective.name})` : '',
          operators: this.selected.operators.length > 0 ? this.selected.operators.map(op => op.name).join(', ') : 'any operator'
        }
      }
    },
    watch: {
      'selected.map' () {
        this.selected.objective = null
      },
      error (err) {
        this.$emit('error', err)
      }
    }
  }
</script>