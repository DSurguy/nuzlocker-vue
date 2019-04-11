<template>
  <div class="container">
    <div class="notFound" test-label="notFound" v-if="notFound">
      <p>
        The run with id {{$route.params.id}} was not found.
      </p>
    </div>
    <div class="error" test-label="error" v-if="error">
      <p>
        There was an error retrieving the run with id {{$route.params.id}}
      </p>
      <p>{{error}}</p>
    </div>
    <div class="runMeta" v-if="!error && !notFound">
      <div class="meta-name"><span test-label="runName">{{run.name}}</span></div>
      <div class="meta-game" test-label="runGame"></div>
      <div class="meta-status" test-label="runStatus"></div>
    </div>
  </div>
</template>

<script>
import { request } from '../services/api/index.js'
import { translateGame } from '../utils/pokemon.js'

export default {
  name: 'RunViewer',
  components: {},
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
      loaded: false,
      notFound: null,
      error: null
    }
  },
  mounted: async function () {
    try{
      this.run = await request(`/runs/${this.$route.params.runId}`, 'get')
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

</style>
