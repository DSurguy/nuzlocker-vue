<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Start New Run</p>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <form>
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input 
                class="input" 
                type="text" 
                placeholder="Pick a name for your run!" 
                v-model="form.name"
                ref="runName"
                v-on:keyup="onNameChange"
              >
            </div>
          </div>
          <div class="field">
            <label class="label">Game</label>
            <div class="control">
              <div class="select">
                <select 
                  v-model="form.game"
                  ref="runGame"
                >
                  <option value="red">Pokémon Red</option>
                  <option value="blue">Pokémon Blue</option>
                </select>
              </div>
            </div>
          </div>
          <div class="notification is-warning" v-if="hasWarning">
            <p>Please fill out the following fields, they're required!</p>
            <ul>
              <li v-for="field in warningFields" v-bind:key="field">- {{field}}</li>
            </ul>
          </div>
          <div class="notification is-danger" v-if="hasError">
            <p>There was an error while creating your run:</p>
            <p>
              <i>
                {{errorMessage}}
              </i>
            </p>
          </div>
        </form>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" v-on:click="onSubmit">Save changes</button>
        <button class="button" v-on:click="onClose">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import request from '../../services/api/index.js'

export default {
  name: 'CreateRunModal',
  props: {
    onClose: Function,
    onComplete: Function
  },
  data: function (){
    return {
      form: {
        name: (new Date()).toLocaleString(),
        game: "red"
      },
      hasWarning: false,
      warningFields: [],
      hasError: false,
      errorMessage: ''
    }
  },
  mounted: async function () {
    this.$refs.runName.select()
  },
  methods: {
    onNameChange: function (){
      if( this.form.name ) this.hasWarning = false
    },
    onSubmit: async function (){
      if( !this.form.name ){
        this.hasWarning = true;
        this.warningFields = ['Name']
      }
      else{
        this.hasWarning = false
        this.warningFields = []
        //submit a new run!
        try{
          await request('/runs', 'post', {
            name: this.form.name,
            game: this.form.game
          })
          this.onComplete()
        } catch (e){
          this.hasError = true
          this.errorMessage = e.message
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
