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
                    :disabled="isDefined(encounterSpecies)"
                    @change="onFieldChange('species')"
                  >
                    <option 
                      v-for="pokemon in pokemonList" 
                      :key="pokemon.id"
                      :value="pokemon.id"
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
                  @change="onFieldChange('level')"
                  test-label="formFieldLevel"
                >
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">
              <input 
                type="checkbox" 
                v-model="form.fields.captured"
                ref="form-captured"
                :disabled="isDefined(encounterCaptured)"
                @change="onFieldChange('captured')"
                test-label="formFieldCaptured"
              >
              &nbsp;Captured
            </label>
          </div>
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input 
                class="input" 
                type="text" 
                placeholder="Missingno." 
                v-model="form.fields.name"
                :disabled="!form.fields.captured"
                ref="form-name"
                @input="onFieldChange('name')"
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
                  :disabled="isDefined(encounterSource)"
                  @change="onFieldChange('source')"
                >
                  <option 
                    v-for="source in sourceList" 
                    :key="source.id"
                    :value="source.id"
                  >{{source.name}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="notification is-warning" v-if="hasWarning" test-label="warning">
            <p>Please fill out the following fields, they're required!</p>
            <ul>
              <li v-for="field in warningFields" :key="field.name || field" test-label="warningField">- {{field}}</li>
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
    encounterSource: String,
    encounterLevel: Number,
    encounterSpecies: Number,
    encounterCaptured: Boolean,
    onComplete: Function
  },
  data: function () {
    return {
      pokemonList: getPokemonByGame(this.run.game),
      sourceList: getEncounterSourceListByGame(this.run.game, this.encounterType).sort(),
      form: {
        fields: {
          name: "",
          species: this.encounterSpecies || 1,
          level: this.encounterLevel || 5,
          source: this.encounterSource,
          captured: this.encounterCaptured
        }
      },
      hasWarning: false,
      warningFields: [],
      hasError: false,
      errorMessage: null,
      requiredFields: [
        {
          name: 'name',
          validator: value => this.form.fields.captured 
            ? isDefined(this.form.fields.name) && this.form.fields.name !== ''
            : true
        },
        'level',
        'source'
      ]
    }
    
  },
  methods: {
    _updateFieldWarnings: async function (options={}){
      let newWarningFields = []
      for( let field of this.requiredFields ){
        let fieldIsValid
        if( field.validator ) fieldIsValid = field.validator();
        else fieldIsValid = isDefined(this.form.fields[field]) && this.form.fields[field] !== '';

        if( !fieldIsValid){
          newWarningFields.push(field)
        }
      }
      if( newWarningFields.length && !options.onlyRemove){
        this.hasWarning = true
        this.warningFields = newWarningFields
      }
      else{
        this.hasWarning = false
        this.warningFields = []
      }
    },
    onFieldChange: function (){
      this._updateFieldWarnings({
        onlyRemove: true
      })
    },
    onSubmit: async function (){
      await this._updateFieldWarnings()
      if( !this.hasWarning ){
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
              captured: this.form.fields.captured,
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
    },
    isDefined
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