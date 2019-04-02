<template>
  <div class="run-list">
    <div class="run" v-for="run in runs" :key="run.id">
      <h2>{{run.title}}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RunList',
  props: {},
  data: function (){
    return {
      runs: []
    }
  },
  mounted: function () {
    //pretend we dynamically retrieve data
    setTimeout(() => {
      this.runs = [
        { id: 0, title: 'Test Run' },
        { id: 1, title: 'Test Run' },
        { id: 2, title: 'Test Run' }
      ]
    }, 1000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.run-list {
  width: 400px;
  padding-top: 100px;
}
.run {
  display: flex;
  box-sizing: border-box;
  height: 64px;
  width: 100%;
  border: 1px solid var(--var-color-grey-lighter);
  border-radius: 4px;
  margin: 10px 0;
  padding: 10px 20px;
}
.run h2 {
  font-size: 20px;
  font-weight: normal;
  margin: 0;
  padding: 0;
}
</style>
