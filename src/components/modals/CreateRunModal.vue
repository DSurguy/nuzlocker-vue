<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Modal title</p>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <p>Test</p>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Save changes</button>
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
    onClose: Function
  },
  data: function (){
    return {}
  },
  mounted: async function () {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
