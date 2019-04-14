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
        <div 
          class="event"
          v-for="event in runEvents"
          v-bind:key="event.id"
        >
          <component 
            v-bind:is="event.component" 
            v-bind:run="run"
            v-bind:event="event"
            class="event"
          ></component>
        </div>
        <div class="prompt" v-if="showSelectStarter">
          <button 
            class="button is-light is-outlined"
            v-on:click="onSelectStarterClick"
            test-label="selectStarterButton"
          >Select your starter!</button>
        </div>
      </div>
    </div>
    <ModalSelectStarter
      v-if="starterModalActive"
      v-bind:run="run"
      v-bind:onComplete="onSelectStarterComplete"
    />
  </div>
</template>

<script>
import { request } from '../services/api/index.js'
import EventRunStart from './events/EventRunStart.vue'
import ModalSelectStarter from './modals/ModalSelectStarter.vue'

import safeGet from '../utils/safeGet.js'

const eventTypeMapping = {
  'run-start': EventRunStart
}

export default {
  name: 'RunViewer',
  components: {
    EventRunStart,
    ModalSelectStarter
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
      notFound: null,
      error: null,
      showSelectStarter: false,
      starterModalActive: false
    }
  },
  mounted: async function () {
    try{
      this.run = await request(`/runs/${this.$route.params.runId}`, 'get')
      await this._updateRunEventsFromStore()
    }
    catch (e) {
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
  methods: {
    _updateRunEventsFromStore: async function (){
      this.runEvents = (await request(`/runs/${this.run.id}/events`, 'get'))
        .map((event) => {
          event.component = eventTypeMapping[event.type]
          return event
        })
      if( safeGet(this.runEvents.slice(-1)[0], 'type') === 'run-start' ){
        this.showSelectStarter = true;
      }
    },
    onSelectStarterClick: function (){
      this.starterModalActive = true
    },
    onSelectStarterComplete: async function (completed=true){
      if( completed ){
        await this._updateRunEventsFromStore()
      }
      this.starterModalActive = false;
    }
  }
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
  width: 100%;
}
.event {
  width: 100%;
  display: flex;
  justify-content: center;
}
.prompt {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
