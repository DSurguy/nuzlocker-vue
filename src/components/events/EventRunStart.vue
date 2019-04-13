<template>
  <div class="event-container">
    <p>{{ introText }}</p>
    <div class="image cycle"></div>
  </div>
</template>

<script>
import {gameIntroText} from '../../utils/pokemon.js'

export default {
  name: 'EventRunStart',
  components: {},
  props: {
    run: Object,
    event: Object
  },
  data: function (){
    return {
      introText: gameIntroText(this.run.game)
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>