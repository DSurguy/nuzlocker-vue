<template>
  <div class="run-viewer bg-pokemon-red-dark">
    <div class="runMeta bg-pokemon-red" v-if="!error && !notFound">
      <div class="meta-name"><span test-label="runName">{{run.name}}</span></div>
      <div class="meta-game" test-label="runGame"></div>
      <div class="meta-status" test-label="runStatus"></div>
    </div>
    <div class="container scrollable">
      <div class="notFound" test-label="notFound" v-if="notFound">
        <p>
          The run with id {{$route.params.runId}} was not found.
        </p>
      </div>
      <div class="error" test-label="error" v-if="error">
        <p>
          There was an error retrieving the run with id {{$route.params.runId}}
        </p>
        <p>{{error}}</p>
      </div>
      <div class="events">
        <component 
          v-for="event in runEvents" 
          v-bind:is="event.component" 
          v-bind:key="event.id"
          v-bind:run="run"
          v-bind:event="event"
          class="event"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '../services/api/index.js'
import { translateGame } from '../utils/dataHelpers.js'
import EventRunStart from './events/EventRunStart.vue'

const eventTypeMapping = {
  'run-start': EventRunStart
}

export default {
  name: 'RunViewer',
  components: {
    EventRunStart
  },
  props: {},
  data: function (){
    return {
      run: {
        name: null,
        game: null,
        data: {
          status: null
        }
      },
      runEvents: [],
      loaded: false,
      notFound: null,
      error: null
    }
  },
  mounted: async function () {
    try{
      this.run = await request(`/runs/${this.$route.params.runId}`, 'get')
      this.runEvents = (await request(`/runs/${this.run.id}/events`, 'get'))
        .map((event) => {
          event.component = eventTypeMapping[event.type]
          return event
        })
      this.loaded = true
    }
    catch (e) {
      this.loaded = true
      if( e.code === 404 ){
        this.error = null
        this.notFound = true
      }
      else {
        this.notFound = null
        this.error = e.message
      }
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.run-viewer{
  position: relative;
  padding-top: 64px;
  box-sizing: border-box;
}
.runMeta {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  width: 100%;
  height: 64px;
}
.events {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
