<template>
  <v-card :class="isOwned ? 'owned' : ''">
    <v-card-media :src="mapImage" height="120px" d-block class="clickable" @click="$router.push(`/strategy/${strat.code}`)">
      <v-card-text class="card-foreground">
        <v-layout column>
          <v-flex xs12>
            <v-avatar size="36" tile>
              <v-icon dark class="icon-small">{{$icons(strat.side)}}</v-icon>
            </v-avatar>
            <v-avatar size="36" tile>
              <v-icon dark class="icon-small">{{$icons(strat.mode)}}</v-icon>
            </v-avatar>
          </v-flex>
          <v-flex xs12>
            <div class="paragraph">
              <strong>{{mapName}}</strong>&nbsp;{{objectiveName}}
            </div>
          </v-flex>
        </v-layout>
      </v-card-text>
      <div class="card-background"></div>
    </v-card-media>

    <v-card-actions>
      <template v-for="op in strat.operators" >
        <v-avatar :key="op.code" size="36" tile>
          <img :src="`/static/images/ops/${op.code}/badge.png`"/>
        </v-avatar>
      </template> 
      <v-spacer />
      <v-avatar size="36" tile>
        <v-icon dark class="icon-medium" color="secondary" >{{$icons('comment')}}</v-icon>
        <span class="badge accent--text"><strong>{{strat.comments}}</strong></span>
      </v-avatar>
      <v-avatar size="36" tile class="clickable">
        <v-icon dark class="icon-medium" :color="isOwned ? 'info' : isLiked ? 'error' : 'secondary'">{{$icons('like')}}</v-icon>
        <span class="badge accent--text"><strong>{{strat.rating}}</strong></span>
      </v-avatar>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  .paragraph {
    padding: 8px;
    font-size: 1.5em;
  }
  .card-foreground {
    z-index: 2;
  }
  .card-background {
    z-index: 1;
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: auto;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.4); /*can be anything, of course*/
  }
  .badge {
    position: absolute;
    font-size: 12px;
  }
  .owned {
    border: 2px solid #81D4FA;
  }

</style>

<script>
  export default {
    props: {
      strat: Object
    },
    computed: {
      mapImage () {
        return `/static/images/maps/${this.strat.map.code}/card.jpg`
      },
      mapName () {
        return this.strat.map.name
      },
      objectiveName () {
        return this.strat.objective.name
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
