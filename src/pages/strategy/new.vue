<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <!-- Strat details --> 
      <v-flex xs12>
        <v-card>
          <v-card-actions>
            <v-avatar>
              <v-icon class="icon-medium">{{$icons('edit')}}</v-icon>
            </v-avatar>
            <span class="nested"><strong>New Strategy</strong></span>
            <v-spacer></v-spacer>
            <v-btn color="primary">
              <v-icon class="icon-small">{{$icons('confirm')}}</v-icon>
              <span class="nested">Save</span>
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
                    :items="operators"
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
              <interactive-map :map="selected.map"></interactive-map>
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

  const strategyService = new StrategyService()
  export default {
    components: {
      stratCard: StratCard,
      taggableInput: TaggableInput,
      radioGroup: RadioGroup,
      interactiveMap: InteractiveMap
    },
    async created () {
      let data = await strategyService.getStaticData()
      this.data = data
      this.selected.side = this.sides[0]
      this.selected.mode = this.modes[0]
    },
    methods: {
      save () {
        this.loading = true
      }
    },
    data () {
      return {
        valid: false,
        loading: false,
        selected: {
          side: {},
          mode: {},
          map: null,
          objective: null,
          operators: [],
          details: null
        },
        data: null
      }
    },
    computed: {
      payload () {
        return {
          side: this.selected.side.code,
          mode: this.selected.mode.code,
          map: this.selected.map,
          objective: this.selected.objective,
          operators: this.selected.operators,
          details: this.selected.details
        }
      },
      operators () {
        return this.data ? this.data.operators.filter(op => op.side === this.selected.side.code) : []
      },
      modes () {
        return this.data ? this.data.modes : []
      },
      sides () {
        return this.data ? this.data.sides : []
      },
      maps () {
        return this.data ? this.data.maps : []
      },
      locations () {
        return this.selected.map ? this.selected.map.locations : []
      },
      objectives () {
        return this.selected.map ? this.selected.map.objectives.filter(ob => ob.modes.indexOf(this.selected.mode.code) > -1) : []
      }
    },
    watch: {
      payload () {
        // console.log(this.payload)
      }
    }
  }
</script>