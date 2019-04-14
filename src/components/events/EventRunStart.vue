<template>
  <div class="event-container">
    <p>{{ introText }}</p>
    <div class="image cycle"></div>
  </div>
</template>

<script>
import {gameIntroText} from '../../utils/dataHelpers.js'

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
  }
}
</script>

<style scoped>
.event-container {
  padding: 20px 0;
  width: 400px;
  text-align: center;
}
.prompt {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>