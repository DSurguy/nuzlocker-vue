<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">New Encounter</p>
      </header>
      <section class="modal-card-body">
        <form>
          <div class="horizontal-field-set">
            <div class="field" strict-portion="60">
              <label class="label">Species</label>
              <div class="control">
                <div class="select full-width">
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
            </div>
            <div class="field" portion="20">
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
          <div class="field">
            <label class="label">{{ encounterType === 'field' ? 'Location': 'Event' }}</label>
            <div class="control">
              <div class="select full-width">
                <select 
                  v-model="form.fields.source"
                  test-label="formFieldSource"
                  v-on:change="onSourceChange"
                >
                  <option 
                    v-for="source in sourceList" 
                    v-bind:key="source.id"
                    v-bind:value="source.id"
                  >{{source.name}}</option>
                </select>
              </div>
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
import { getPokemonByGame, getEncounterSourceListByGame } from '../../utils/dataHelpers.js'
import { request } from '../../services/api/index.js'
import isDefined from '../../utils/isDefined.js'

export default {
  name: 'ModalEncounter',
  components: {},
  props: {
    run: Object,
    encounterType: String,
    onComplete: Function
  },
  data: function () {
    return {
      pokemonList: getPokemonByGame(this.run.game),
      sourceList: getEncounterSourceListByGame(this.run.game, this.encounterType).sort(),
      form: {
        fields: {
          name: "",
          species: 1,
          level: 5,
          source: 0
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
    onSourceChange: function (){},
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
              type: this.encounterType,
              id: this.form.fields.source
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
.horizontal-field-set {
  display: flex;
  justify-content: flex-start;
}
.horizontal-field-set .field {
  margin-right: 1em;
}
.horizontal-field-set .field:last-child {
  margin-right: 0;
}
.horizontal-field-set .field[strict-portion="80"]{
  width: 80%;
}
.horizontal-field-set .field[portion="20"] {
  max-width: 20%;
}
.select.full-width {
  width: 100%;
}
.select.full-width select{
  width: 100%;
}
</style>