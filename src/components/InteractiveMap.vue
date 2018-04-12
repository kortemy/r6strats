<template>
  <v-card>
    <v-card-actions>
      <v-avatar>
        <v-icon class="icon-medium">{{$icons('map')}}</v-icon>
      </v-avatar>
      <span class="nested"><strong>{{map ? map.name : 'No map selected'}}</strong></span>
    </v-card-actions>
    <v-flex xs12 class="bounds" ref="bounds" v-show="!!map">
      <div class="controls left">
        <v-btn v-for="l in layers" :key="l" small light @click="layer = l">
          {{l}}
        </v-btn>
      </div>
      <div class="controls right">
        <v-btn @click="resize(-0.1)" fab small light>
          <v-icon>{{$icons('minus')}}</v-icon>
        </v-btn>
        <v-btn @click="resize(0.1)" fab small light>
          <v-icon>{{$icons('plus')}}</v-icon>
        </v-btn>
      </div>
      <div class="controls bottom right nested">
        <span style="font-size: 10px;">maps by <a href="http://r6maps.com" target="_blank">r6maps.com</a></span>
      </div>
      <div class="draggable" ref="draggable">
        <template v-for="loc in locations">
          <div :key="loc.code" class="location" :style="`left: ${loc.x}px; top: ${loc.y}px;`">
            <v-chip :color="tagColor(loc.code)" text-color="white">
              {{loc.name}}
            </v-chip>
          </div>
        </template>
        <img v-if="!!map" :src="`/static/images/maps/${map.code}/${layer}.jpg`"/>
      </div>
    </v-flex>
  </v-card>
</template>

<style scoped>
  .bounds {
    position: relative;
    overflow: hidden;
    height: 600px;
    opacity: 0;
    background-color: #424242;
    background-image: url("/static/images/background-mesh.png");
    background-repeat: repeat;
  } 

  .draggable {
    position: absolute;
    z-index: 9;
  }

  .location {
    position: absolute;
    z-index: 10;
  }

  .controls {
    position: absolute;
    z-index: 11;
  }

  .left {
    left: 0;
  }

  .right {
    right: 0;
  }

  .bottom {
    bottom: 0;
  }
</style>

<script>
  export default {
    props: ['map', 'focus', 'objective'],
    mounted () {
      if (this.map) {
        this.preload()
      }
    },
    methods: {
      preload () {
        let mapImage = new Image()
        mapImage.src = `/static/images/maps/${this.map.code}/${this.layer}.jpg`
        mapImage.onload = this.init
      },
      init () {
        this.bounds.el.style.opacity = 1
        this.resize(0)

        let x = -1 * parseInt((this.draggable.w - this.bounds.w) / 2)
        let y = -1 * parseInt((this.draggable.h - this.bounds.h) / 2)
        this.move(x, y)

        this.draggable.el.onmousedown = this.startMoving
      },
      startMoving (evt) {
        evt = evt || window.event
        evt.preventDefault()

        this.bounds.el.style.cursor = 'move'

        let posX = evt.clientX
        let posY = evt.clientY
        let diffX = posX - this.draggable.el.style.left.replace('px', '')
        let diffY = posY - this.draggable.el.style.top.replace('px', '')

        document.onmouseup = this.stopMoving
        document.onmousemove = (evt) => {
          evt = evt || window.event
          let posX = evt.clientX
          let posY = evt.clientY
          let aX = posX - diffX
          let aY = posY - diffY

          this.move(aX, aY)
        }
      },
      stopMoving (evt) {
        this.bounds.el.style.cursor = 'default'
        document.onmousemove = null
        document.onmouseup = null
      },
      move (x, y) {
        this.draggable.el.style.left = x + 'px'
        this.draggable.el.style.top = y + 'px'
      },
      moveTo (loc) {
        this.layer = loc.layer
        let x = (1 * parseInt(this.bounds.w / 2)) - loc.x
        let y = (1 * parseInt(this.bounds.h / 2)) - loc.y
        this.move(x, y)
      },
      resize (delta) {
        this.zoom = this.zoom + (delta || 0)
        this.draggable.el.style.zoom = this.zoom
      },
      tagColor (code) {
        return this.focus === code ? 'primary' : 'secondary'
      }
    },
    data () {
      return {
        layer: '1f',
        zoom: 1
      }
    },
    computed: {
      objectives () {
        return this.objective.split('&')
      },
      layers () {
        return this.map ? this.map.layers : []
      },
      locations () {
        return this.map ? this.map.locations.filter(loc => loc.layer === this.layer) : []
      },
      focusedLocation () {
        return this.map ? this.map.locations.filter(loc => loc.code === this.focus)[0] : null
      },
      bounds () {
        let bounds = this.$refs.bounds
        return {
          el: bounds,
          w: parseInt(bounds.clientWidth),
          h: parseInt(bounds.clientHeight)
        }
      },
      draggable () {
        let draggable = this.$refs.draggable
        return {
          el: draggable,
          w: parseInt(draggable.clientWidth * this.zoom),
          h: parseInt(draggable.clientHeight * this.zoom)
        }
      }
    },
    watch: {
      map () {
        if (this.map) {
          this.preload()
        }
      },
      focusedLocation () {
        this.moveTo(this.focusedLocation || { layer: this.layer, x: 0, y: 0 })
      }
    }
  }
</script>