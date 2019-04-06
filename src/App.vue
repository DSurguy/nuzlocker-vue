<template>
  <div id="app">
    <div class="container">
      <RunList />
    </div>
  </div>
</template>

<script>
import RunList from './components/RunList.vue'

export default {
  name: 'app',
  components: {
    RunList
  }
}
</script>

<style>
/* bulma color scheme and font */
:root {
  --var-color-white: hsl(0, 0%, 100%);
  --var-color-black: hsl(0, 0%, 4%);
  --var-color-light: hsl(0, 0%, 96%);
  --var-color-dark: hsl(0, 0%, 21%);
  --var-color-primary: hsl(171, 100%, 41%);
  --var-color-info: hsl(204, 86%, 53%);
  --var-color-link: hsl(217, 71%, 53%);
  --var-color-success: hsl(141, 71%, 48%);
  --var-color-warning: hsl(48, 100%, 67%);
  --var-color-danger: hsl(348, 100%, 61%);
  --var-color-black-bis: hsl(0, 0%, 7%);
  --var-color-black-ter: hsl(0, 0%, 14%);
  --var-color-grey-darker: hsl(0, 0%, 21%);
  --var-color-grey-dark: hsl(0, 0%, 29%);
  --var-color-grey: hsl(0, 0%, 48%);
  --var-color-grey-light: hsl(0, 0%, 71%);
  --var-color-grey-lighter: hsl(0, 0%, 86%);
  --var-color-white-ter: hsl(0, 0%, 96%);
  --var-color-white-bis: hsl(0, 0%, 98%);
}

#app {
  margin-top: 60px;
}

.container {
  display: flex;
  justify-content: center;
}
</style>
