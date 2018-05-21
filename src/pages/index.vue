<template>
  <v-container grid-list-md>
    <v-card dark tile class="collapser-card">
      <v-card-actions>
        <v-avatar>
          <v-icon class="icon-medium">{{$icons('home')}}</v-icon>
        </v-avatar>
        <span class="card-title"><strong>My Strategies</strong></span>
        <v-spacer></v-spacer>
        <v-btn icon @click="myStrats.show = !myStrats.show">
          <v-icon>{{myStrats.show ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-container v-if="myStrats.show" class="list-wrapper">
      <v-layout row wrap>
        <v-flex xs12 md6 lg4 v-for="strat in shownMyStrats" :key="strat.id">
          <strat-card :strat="strat"/>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-if="shownMyStrats.length === 0">
        <v-flex xs12>
          You didn't create any strats yet. <span class="link" @click="$router.push('/strategy/new')">Create a strategy.</span>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card dark tile class="collapser-card">
      <v-card-actions>
        <v-avatar>
          <v-icon class="icon-medium">{{$icons('like')}}</v-icon>
        </v-avatar>
        <span class="card-title"><strong>Liked Strategies</strong></span>
        <v-spacer></v-spacer>
        <v-btn icon @click="favStrats.show = !favStrats.show">
          <v-icon>{{favStrats.show ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-container v-if="favStrats.show" class="list-wrapper">
      <v-layout row wrap>
        <v-flex xs12 md6 lg4 v-for="strat in shownFavStrats" :key="strat.id">
          <strat-card :strat="strat"/>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-if="shownFavStrats.length === 0">
        <v-flex xs12>
          <span class="nested">You didn't like any strats yet. <span class="link" @click="$router.push('/search')">Look at some strategies.</span></span>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<style scoped>
.collapser-card {
  margin-bottom: 14px;
}
.list-wrapper {
  padding: 0 0 14px 0;
}
</style>

<script>
  import StrategyService from '@/core/StrategyService'
  import StratCard from '@/components/StratCard'

  export default {
    components: {
      stratCard: StratCard
    },
    created () {
      if (!this.$currentUser) {
        this.$router.push('/search')
        return
      }
      this.strategyService = new StrategyService(this.$firestore)
      this.myStrats.query = { author: this.$currentUser.code }
      this.favStrats.query = { code: this.$currentUser.likes }
      this.load()
    },
    methods: {
      async load () {
        try {
          await this.loadMore('myStrats')
        } catch (err) { this.$eventBus.$emit('error', err) }
      },
      async loadMore (prop) {
        let data = await this.strategyService.getStrats(this[prop].query)
        this[prop].data = data || []
      }
    },
    data () {
      return {
        strategyService: null,
        myStrats: {
          show: true,
          limit: 6,
          query: {},
          data: []
        },
        favStrats: {
          show: true,
          limit: 6,
          query: {},
          data: []
        }
      }
    },
    computed: {
      shownMyStrats () {
        return this.myStrats.data.slice(0, this.myStrats.limit)
      },
      shownFavStrats () {
        return this.favStrats.data.slice(0, this.favStrats.limit)
      }
    }
  }
</script>