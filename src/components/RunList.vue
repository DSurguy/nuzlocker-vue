<template>
  <div class="run-list">
    <div class="run-list-header">
      <button 
        class="button is-primary"
        v-on:click="createRun"
      >
        <i class="fas fa-plus"></i>Create Run
      </button>
    </div>
    <div class="run-list-content"></div>
    <div class="run" v-for="run in runs" :key="run.id">
      <h2>{{run.title}}</h2>
    </div>
    <CreateRunModal v-if="createRunActive" v-bind:onClose="closeCreateRunModal" />
  </div>
</template>

<script>
import request from '../services/api/index.js'
import CreateRunModal from './modals/CreateRunModal.vue'

export default {
  name: 'RunList',
  components: {
    CreateRunModal
  },
  props: {},
  data: function (){
    return {
      runs: [],
      createRunActive: false
    }
  },
  mounted: async function () {
    try{
      this.runs = await request('/runs', 'get')
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    createRun: function (event) {
      this.createRunActive = true
    },
    closeCreateRunModal: function (event){
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
  display: flex;
  box-sizing: border-box;
  height: 64px;
  width: 100%;
  border: 1px solid var(--var-color-grey-lighter);
  border-radius: 4px;
  margin: 10px 0;
  padding: 10px 20px;
}
.run h2 {
  font-size: 20px;
  font-weight: normal;
  margin: 0;
  padding: 0;
}
</style>
