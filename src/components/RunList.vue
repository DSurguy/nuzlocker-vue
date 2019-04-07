<template>
  <div class="run-list">
    <div class="run-list-header">
      <div class="notification is-danger" v-if="error">
        <p>There was an error while retrieving runs:</p>
        <p>
          <i>
            <span test-label="requestError">{{error}}</span>
          </i>
        </p>
      </div>
      <button 
        test-label="createNewRunButton"
        class="button is-primary"
        v-on:click="createRun"
      >
        <i class="fas fa-plus"></i>Create Run
      </button>
    </div>
    <div 
      class="run" 
      v-for="run in runs" 
      :key="run.id"
      test-label="run"
    >
      <h2><span test-label="runName">{{run.name}}</span></h2>
      <p>Game: <span test-label="runGame">{{translateGame(run.game)}}</span></p>
    </div>
    <CreateRunModal 
      v-if="createRunActive" 
      v-bind:onClose="onCreateRunModalClose"
      v-bind:onComplete="onCreateRunModalComplete"
    />
  </div>
</template>

<script>
import { request } from '../services/api/index.js'
import CreateRunModal from './modals/CreateRunModal.vue'
import {translateGame} from '../utils/pokemon.js'

export default {
  name: 'RunList',
  components: {
    CreateRunModal
  },
  props: {},
  data: function (){
    return {
      runs: [],
      createRunActive: false,
      error: null
    }
  },
  mounted: async function () {
    try{
      this.runs = await request('/runs', 'get')
    } catch (e) {
      this.error = e.message;
    }
  },
  methods: {
    translateGame,
    createRun: function () {
      this.createRunActive = true
    },
    onCreateRunModalComplete: async function (){
      this.createRunActive = false
      this.runs = await request('/runs', 'get')
    },
    onCreateRunModalClose: function (){
      this.createRunActive = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.run-list {
  width: 400px;
  padding-top: 100px;
}
.run-list-header {
  display: flex;
  justify-content: flex-start;
  margin: 10px 0;
}
.run-list-header button i {
  margin-right: 10px;
}
.run {
  box-sizing: border-box;
  height: 72px;
  width: 100%;
  border: 1px solid var(--var-color-grey-lighter);
  border-radius: 4px;
  margin: 10px 0;
  padding: 5px 20px;
}
.run h2 {
  font-size: 20px;
  font-weight: normal;
  margin: 0;
  padding: 0;
}
</style>
