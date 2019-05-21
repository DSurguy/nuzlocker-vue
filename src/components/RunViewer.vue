<template>
  <div class="run-viewer">
    <div class="run-meta" v-if="!error && !notFound">
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
    <div class="run-controls">
      <div class="sub-menu" v-show="showSubMenu">
        <button 
          v-for="(button, index) in subMenuActions"
          :key="index"
          class="sub-button button is-dark"
        >
          <div class="sub-button-icon">
            <i class="fas" :class="[subMenuActions[index].icon]"></i>
          </div>
          <div class="sub-button-text">
            {{subMenuActions[index].text}}
          </div>
        </button>
      </div>
      <div class="main-menu">
        <div 
          class="main-button-container"
          :class="{'active': activeSubMenu === 'encounters'}"
        >
          <button 
            class="encounters button main-button"
            :class="[activeSubMenu === 'encounters' ? 'is-dark' : 'is-light']"
            :disabled="activeSubMenu === 'encounters'"
            v-on:click="onMenuButtonClick('encounters')"
            text-label="encountersButton"
          >
            Encounters
          </button>
        </div>
        <div 
          class="main-button-container"
          :class="{'active': activeSubMenu === 'goals'}"
        >
          <button 
            class="goals button main-button"
            :class="[activeSubMenu === 'goals' ? 'is-dark' : 'is-light']"
            :disabled="activeSubMenu === 'goals'"
            v-on:click="onMenuButtonClick('goals')"
            text-label="goalsButton"
          >
            Goals
          </button>
        </div>
        <div 
          class="main-button-container"
          :class="{'active': activeSubMenu === 'manage'}"
        >
          <button 
            class="manage button main-button"
            :class="[activeSubMenu === 'manage' ? 'is-dark' : 'is-light']"
            :disabled="activeSubMenu === 'manage'"
            v-on:click="onMenuButtonClick('manage')"
            text-label="manageButton"
          >
            Manage Run
          </button>
        </div>
      </div>
    </div>
    <div 
      class="sub-menu-background" 
      v-show="showSubMenu"
      v-on:click="closeSubMenu"
    ></div>
  </div>
</template>

<script>
import { request } from '../services/api/index.js'
import EventRunStart from './events/EventRunStart.vue'
import EventEncounter from './events/EventEncounter.vue'
import ModalSelectStarter from './modals/ModalSelectStarter.vue'

import safeGet from '../utils/safeGet.js'

const eventTypeMapping = {
  'run-start': EventRunStart,
  'encounter': EventEncounter
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
      starterModalActive: false,
      activeSubMenu: false,
      showSubMenu: false,
      subMenuActions: []
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
    onSelectStarterComplete: async function (cancelled=false){
      if( !cancelled ){
        await this._updateRunEventsFromStore()
        this.showSelectStarter = false;
      }
      this.starterModalActive = false;
    },
    onMenuButtonClick: function (menuCategory){
      switch(menuCategory){
        case 'encounters':
          this.subMenuActions = [
            { icon: 'fa-leaf', text: 'Field', action: "encounterField" },
            { icon: 'fa-exclamation', text: 'Event', action: "encounterEvent" },
            { icon: 'fa-list', text: 'Stats', action: "encounterStats" }
          ]
        break;
        case 'goals':
          this.subMenuActions = [
            { icon: 'fa-gem', text: 'Update Goals', action: "goalsUpdate" },
            { icon: 'fa-list-alt', text: 'Static View', action: "goalsStaticView" }
          ]
        break;
        case 'manage':
          this.subMenuActions = [
            { icon: 'fa-database', text: 'PokeDex', action: "managePokeDex" },
            { icon: 'fa-map-marked-alt', text: 'RouteDex', action: "manageRouteDex" },
            { icon: 'fa-wrench', text: 'Edit Status', action: "manageEditStatus" }
          ]
        break;
      }
      this.activeSubMenu = menuCategory;
      this.showSubMenu = true;
    },
    closeSubMenu: function (){
      this.showSubMenu = false;
      this.activeSubMenu = null;
      this.subMenuActions = []
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
.run-meta {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 64px;
  background-color: var(--var-color-grey-dark);
  color: #fff;
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
.run-controls {
  position: fixed;
  z-index: 500;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: 72px;
}
.run-controls .main-menu {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--var-color-grey);
  width: 100%;
}
.run-controls .main-button-container {
  display: flex;
  padding: 16px 0;
  justify-content: center;
  align-items: center;
  width: 30%;
  max-width: 200px;
  height: 100%;
}
.run-controls .main-button-container.active {
  background-color: var(--var-color-grey-darker);
}
.run-controls .main-button {
  width: 100%;
  margin-right: 3%;
}
.run-controls .main-button:last-child{
  margin-right: 0;
}
.run-controls .sub-menu {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background-color: var(--var-color-grey-darker);
  display: flex;
  justify-content: center;
  align-items: center;
}
.run-controls .sub-button{
  width: 30%;
  max-width: 200px;
  height: 56px;
  justify-content: center;
  flex-direction: column;
  margin-right: 3%;
}
.run-controls .sub-button:last-child{
  margin-right: 0;
}
.run-controls .sub-button > div {
  display: block;
}
.sub-menu-background {
  z-index: 400;
  background: rgba(255,255,255,0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
