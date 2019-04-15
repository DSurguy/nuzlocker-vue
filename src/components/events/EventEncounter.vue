<template>
  <div class="event-encounter bg-pokemon-red">
    <div class="event-encounter-header">
      <div class="event-icon">
        <i class="fas fa-exclamation"></i>
      </div>
      <h3 class="source">{{sourceName}}</h3>
      <div class="header-fade"></div>
    </div>
    <div class="event-encounter-details">
      <div class="pokemon-details bg-pokemon-red-dark">
        <div class="sprite">
          <div 
            class="sprite-pokemon"
            v-bind:class="{[`i-${event.species}`]: true}"
          ></div>
        </div>
        <div class="species">
          <span>{{pokemonDetails.name}}</span>
        </div>
        <div class="level-details">
          <span class="level-label">Lv</span>
          <span class="level-data">{{event.level}}</span>
        </div>
      </div>
      <div 
        class="capture-details"
        v-bind:class="{failed: !event.outcome.captured}"
      >
        <img class="sprite" v-bind:src="captureIcon" />
        <div class="capture-data">
          <span class="capture-name">{{event.outcome.captured ? event.outcome.name : 'Not Captured'}}</span>  
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPokemonById, getEncounterSourceByGame } from '../../utils/dataHelpers.js'
import iconPokeball from '../../assets/icons/pokeball.png'

export default {
  name: 'EventEncounter',
  components: {},
  props: {
    event: Object,
    run: Object
  },
  data: function (){
    return {
      pokemonDetails: getPokemonById(this.event.species),
      sourceName: getEncounterSourceByGame(this.run.game, this.event.source.type, this.event.source.id),
      captureIcon: iconPokeball
    }
  },
  methods: {}
}

</script>

<style scoped>
.event-encounter {
  border-radius: 8px;
  border: 1px solid var(--var-pokemon-red-dark);
  width: 400px;
  height: 84px;
  overflow: hidden;
}
.event-encounter-header {
  display: block;
  height: 32px;
  display: flex;
  flex-wrap: wrap;
}
.event-icon {
  color: var(--var-pokemon-red-dark);
  width: 32px;
  height: 31px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  flex: 0 0 auto;
  text-shadow: none;
}
.source{
  margin: 0;
  line-height: 31px;
  font-size: 18px;
  font-weight: normal;
  width: calc( 100% - 32px );
}
.header-fade {
  background: rgb(194,76,38);
  background: linear-gradient(270deg, rgba(194,76,38,0) 0%, rgba(194,76,38,0.75) 30%, rgba(194,76,38,1) 100%);
  height: 1px;
  width: 240px;
  margin-top: auto;
}
.event-encounter-details {
  display: flex;
  align-items: flex-end;
  margin: 8px 0;
  height: 36px;
}
.pokemon-details {
  width: 220px;
  height: 36px;
  display: flex;
  font-size: 16px;
  border-radius: 18px;
  margin: 0 10px;
}
.pokemon-details .sprite {
  border-right: 1px solid var(--var-pokemon-red);
  width: 46px;
  height: 100%;
  display: flex;
  justify-content: center;
}
.pokemon-details .sprite .sprite-pokemon {
  margin-left: -6px;
}

.pokemon-details .species {
  flex-grow: 1;
  text-align: center;
  line-height: 34px;
}
.pokemon-details .level-details {
  border-left: 1px solid var(--var-pokemon-red);
  min-width: 48px;
  padding-right: 6px;
  height: 100%;
  line-height: 34px;
  text-align: left;
}
.level-label {
  color: var(--var-pokemon-red-light);
  margin-left: 4px;
  margin-right: 2px;
}
.capture-details {
  width: 140px;
  height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--var-color-white-ter);
  border-radius: 12px;
  color: var(--var-color-grey-dark);
  text-shadow: none;
}
.capture-details.failed{
  background-color: var(--var-color-grey-lighter);
}
.capture-details.failed .sprite {
  filter: grayscale(100%);
  filter: gray;
}
.capture-details .sprite {
  width: 20px;
  height: 20px;
  margin: 2px;
}
.capture-details .capture-data{
  line-height: 22px;
  height: 100%;
}
.capture-details.failed .capture-data{
  color: var(--var-color-grey);
}
</style>