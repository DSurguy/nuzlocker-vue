<template>
  <div class="event-container">
    <h3>You encountered {{pokemonDetails.name[0].toUpperCase()+pokemonDetails.name.substr(1)}}!</h3>
  </div>
</template>

<script>
import { getPokemonById } from '../../utils/dataHelpers.js'

export default {
  name: 'EventEncounter',
  components: {},
  props: {
    event: Object,
    run: Object
  },
  data: function (){
    return {
      pokemonDetails: getPokemonById(this.event.species)
    }
  },
  methods: {}
}

</script>

<style scoped>

</style>