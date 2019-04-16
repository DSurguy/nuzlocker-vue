<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Select Starting Pokemon</p>
      </header>
      <section class="modal-card-body">
        <form>
          <div>
            <div class="select">
              <select 
                v-model="form.fields.species"
                test-label="formFieldSpecies"
                v-on:change="onSpeciesChange"
              >
                <option 
                  v-for="pokemon in pokemonList" 
                  v-bind:key="pokemon.id"
                  v-bind:value="pokemon.id"
                >{{pokemon.id}} - {{pokemon.name}}</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="label">Level</label>
            <div class="control">
              <input 
                class="input" 
                type="number"  
                v-model="form.fields.level"
                ref="form-level"
                v-on:input="onLevelChange"
                test-label="formFieldLevel"
              >
            </div>
          </div>
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input 
                class="input" 
                type="text" 
                placeholder="Missingno." 
                v-model="form.fields.name"
                ref="form-name"
                v-on:input="onNameChange"
                test-label="formFieldName"
              >
            </div>
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
              <i test-label="errorMessage">
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
import { getPokemonByGame } from '../../utils/dataHelpers.js'
import { request } from '../../services/api/index.js'
import isDefined from '../../utils/isDefined.js'

export default {
  name: 'ModalSelectStarter',
  components: {},
  props: {
    run: Object,
    onComplete: Function
  },
  data: function () {
    return {
      pokemonList: getPokemonByGame(this.run.game),
      form: {
        fields: {
          name: "",
          species: 1,
          level: 5
        }
      },
      hasWarning: false,
      warningFields: [],
      hasError: false,
      errorMessage: null
    }
  },
  methods: {
    onSpeciesChange: function (){},
    onNameChange: function (){
      if( this.form.fields.name !== '' && isDefined(this.form.fields.name) ){
        this.warningFields = this.warningFields.filter(field => field !== 'name')
        if( this.warningFields.length === 0 )
          this.hasWarning = false
      }
    },
    onLevelChange: function (){
      if( this.form.fields.level !== '' && isDefined(this.form.fields.level) ){
        this.warningFields = this.warningFields.filter(field => field !== 'level')
        if( this.warningFields.length === 0 )
          this.hasWarning = false
      }
    },
    onSubmit: async function (){
      const requiredFields = [
        'name',
        'level'
      ]
      let newWarningFields = []
      for( let field of requiredFields ){
        if( this.form.fields[field] === '' || !isDefined(this.form.fields[field]) ){
          newWarningFields.push(field)
        }
      }
      if( newWarningFields.length ){
        this.hasWarning = true
        this.warningFields = newWarningFields
      }
      else{
        this.hasWarning = false
        this.warningFields = []
        try{
          await request(`/runs/${this.run.id}/events`, 'post', {
            type: 'encounter',
            species: this.form.fields.species,
            level: this.form.fields.level,
            source: {
              type: 'event',
              id: 'starter'
            },
            outcome: {
              captured: true,
              name: this.form.fields.name,
            }
          })
          this.onComplete()
        } catch (e){
          this.hasError = true
          this.errorMessage = e.message
        }
      }
    },
    onClose: function (){
      this.onComplete(true)
    }
  }
}
</script>

<style scoped>

</style>