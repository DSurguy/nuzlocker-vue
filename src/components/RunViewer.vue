<template>
  <div class="run-viewer">
    <div class="run-meta" v-if="!error && !notFound">
      <div class="meta-name"><span test-label="runName">{{run.name}}</span></div>
      <div class="meta-game" test-label="runGame"></div>
      <div class="meta-status" test-label="runStatus"></div>
    </div>
    <div class="run-events-container scrollable">
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
          :key="event.id"
        >
          <component 
            :is="event.component" 
            :run="run"
            :event="event"
          ></component>
        </div>
        <div class="prompt" v-if="showSelectStarter">
          <button 
            class="button is-light is-outlined"
            @click="onSelectStarterClick"
            test-label="selectStarterButton"
          >Select your starter!</button>
        </div>
      </div>
    </div>
    <ModalEncounter
      v-if="encounterModalActive"
      :run="run"
      :onComplete="onEncounterComplete"
      :encounterType="encounterModal.type"
      :encounterSource="encounterModal.source"
      :encounterLevel="encounterModal.level"
      :encounterSpecies="encounterModal.species"
      :encounterCaptured="encounterModal.captured"
    />
    <div class="run-controls">
      <div class="sub-menu" v-show="showSubMenu" test-label="subMenu">
        <button 
          v-for="(button, index) in subMenuActions"
          :key="index"
          class="sub-button button is-dark"
          :test-label="button.action+'SubButton'"
          @click="onSubMenuButtonClick(button.action)"
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
          v-for="(menuCategory) in menuCategories"
          :key="menuCategory"
          class="main-button-container"
          :class="{'active': activeSubMenu === menuCategory}"
        >
          <button 
            class="button main-button"
            :class="[activeSubMenu === menuCategory ? 'is-dark' : 'is-light', menuCategory]"
            :disabled="activeSubMenu === menuCategory"
            :test-label="menuCategory+'Button'"
            @click="onMenuButtonClick(menuCategory)"
          >
            {{menuCategory[0].toUpperCase() + menuCategory.substr(1)}}
          </button>
        </div>
      </div>
    </div>
    <div 
      class="sub-menu-background" 
      v-show="showSubMenu"
      @click="closeSubMenu"
      test-label="subMenuBackground"
    ></div>
  </div>
</template>

<script>
import { request } from '../services/api/index.js'
import EventRunStart from './events/EventRunStart.vue'
import EventEncounter from './events/EventEncounter.vue'
import ModalEncounter from './modals/ModalEncounter.vue'

import safeGet from '../utils/safeGet.js'

/**
 * Declare some non-reactive data and export it
 *  so we can use it in test if need be
 */
export const eventTypeMapping = {
  'run-start': EventRunStart,
  'encounter': EventEncounter
}

export const subMenuActions = {
  'encounters': [
    { icon: 'fa-leaf', text: 'Field', action: "encounterField" },
    { icon: 'fa-exclamation', text: 'Event', action: "encounterEvent" },
    { icon: 'fa-list', text: 'Stats', action: "encounterStats" }
  ],
  'goals': [
    { icon: 'fa-gem', text: 'Update Goals', action: "goalsUpdate" },
    { icon: 'fa-list-alt', text: 'Static View', action: "goalsStaticView" }
  ],
  'manage': [
    { icon: 'fa-database', text: 'PokeDex', action: "managePokeDex" },
    { icon: 'fa-map-marked-alt', text: 'RouteDex', action: "manageRouteDex" },
    { icon: 'fa-wrench', text: 'Edit Status', action: "manageEditStatus" }
  ]
}

export default {
  name: 'RunViewer',
  components: {
    EventRunStart,
    ModalEncounter
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
      encounterModalActive: false,
      activeSubMenu: false,
      showSubMenu: false,
      subMenuActions: [],
      menuCategories: ['encounters', 'goals', 'manage'],
      encounterModal: {
        type: null,
        source: null,
        level: null,
        species: null,
        captured: null
      }
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
      else{
        this.showSelectStarter = false;
      }
    },
    onSelectStarterClick: function (){
      //Pre-load some data for the encounter modal
      this.encounterModal.type = 'event';
      this.encounterModal.source = 'starter';
      this.encounterModal.captured = true;
      this.encounterModalActive = true
    },
    onEncounterComplete: async function (cancelled=false){
      if( !cancelled ){
        await this._updateRunEventsFromStore()
      }
      this.encounterModalActive = false;
      this.encounterModal = {
        type: null,
        source: null,
        level: null,
        species: null,
        captured: null
      }
    },
    onMenuButtonClick: function (menuCategory){
      this.subMenuActions = subMenuActions[menuCategory]
      this.activeSubMenu = menuCategory;
      this.showSubMenu = true;
    },
    onSubMenuButtonClick: function (action) {
      switch(action){
        case 'encounterField':
          this.encounterModal.type = "field";
          this.encounterModalActive = true; 
          break;
        case 'encounterEvent':
          this.encounterModal.type = "event";
          this.encounterModalActive = true; 
          break;
      }
      this.closeSubMenu()
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
  padding-bottom: 64px;
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
.run-events-container {
  height: 100%;
  overflow-y: scroll;
}
.events {
  width: 100%;
}
.event {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 2em;
}
.prompt {
  width: 100%;
  display: flex;
  justify-content: center;
}
.run-controls {
  position: fixed;
  z-index: 39;
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
  height: 64px;
}
.run-controls .main-button-container {
  display: flex;
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
  z-index: 31;
  background: rgba(255,255,255,0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
