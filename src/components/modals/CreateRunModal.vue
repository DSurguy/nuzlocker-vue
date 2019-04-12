<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Start New Run</p>
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
                v-on:input="onNameChange"
                test-label="formName"
              >
            </div>
          </div>
          <div class="field">
            <label class="label">Game</label>
            <div class="control">
              <div class="select">
                <select 
                  v-model="form.game"
                  test-label="formGame"
                >
                  <option value="red">Pokémon Red</option>
                  <option value="blue">Pokémon Blue</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="checkbox">
              <input 
                type="checkbox"
                v-model="form.openRun"
                test-label="openRun"
              />
              Open run after create ?
            </label>
          </div>
          <div class="notification is-warning" v-if="hasWarning" test-label="warning">
            <p>Please fill out the following fields, they're required!</p>
            <ul>
              <li v-for="field in warningFields" v-bind:key="field" test-label="warningField">- {{field}}</li>
            </ul>
          </div>
          <div class="notification is-danger" v-if="hasError" test-label="error">
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
        <button 
          class="button is-success" 
          v-on:click="onSubmit"
          test-label="buttonSubmit"
        >
          Save changes
        </button>
        <button 
          class="button" 
          v-on:click="onClose"
          test-label="buttonClose"
        >
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import {request} from '../../services/api/index.js'

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
        game: "red",
        openRun: true
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
          const createdRun = await request('/runs', 'post', {
            name: this.form.name,
            game: this.form.game
          })
          if( this.form.openRun ){
            this.$router.push(`/runs/${createdRun.id}`)
          }
          else this.onComplete()
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
