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
import { getPokemonByGame } from '../../utils/dataHelpers.js'

export default {
  name: 'ModalSelectStarter',
  components: {},
  props: {
    game: Object,
    run: Object
  },
  data: function () {
    return {
      pokemonList: getPokemonByGame(this.game.id),
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
    onNameChange: function (){},
    onLevelChange: function (){},
    onSubmit: function (){},
    onClose: function (){}
  }
}
</script>

<style scoped>

</style>