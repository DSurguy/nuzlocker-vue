# nuzlocker-vue

https://nuzlocker.surgingforward.net

[![Codeship Status for DSurguy/nuzlocker-vue](https://app.codeship.com/projects/3fa72ba0-40a1-0137-4c79-3e774fd31b7a/status?branch=master)](https://app.codeship.com/projects/335883)

## Overview and Goals
This project serves as a learning tool for Vue.

It has been bootstrapped using the Vue CLI. I'm striving to keep it as lightweight as possible, with the concession that we'll probably use some of the following for shortcuts:
- css frameworks
- fontawesome

I am going to avoid using any "out of the box" frameworks or data management for vue, striving to use as much of the vanilla toolset as possible.

Fingers crossed!

### Goals

#### Nuzlocke Rules
https://bulbapedia.bulbagarden.net/wiki/Nuzlocke_Challenge

The following nuzlocke ruleset will be supported, and any additional flexibility is a nice bonus
- Can only capture the first encounter on a route
- Must nickname all pokemon
- Fainted pokemon are considered "dead"
- White/Black out is game over
- The first time a pokemon is encountered is the only time it can be caught
  - Once a pokemon is "seen" it cannot be caught

#### Completion Checklist
The following items should be completed for this project to be considered "complete"
- [ ] Features
  - [x] Create a run to track a nuzlocke challenge for Pokemon Red / Blue 
  - [ ] Track Run Events
    - [x] Run Started
    - [ ] Starter Pokemon
    - [ ] Pokemon Seen
    - [ ] Pokemon Captured
    - [ ] Route Encounters
      - [ ] Whether a route has had an encounter
      - [ ] What the encounter was on the route
    - [ ] Gyms Completed
    - [ ] Win/Loss status of run
  - [ ] Track Run Pokemon
    - [ ] Nickname
    - [ ] Species
    - [ ] Status
      - [ ] Level
      - [ ] Alive / Dead
- [ ] Data Storage
  - [ ] Persistent
    - [x] Local Storage
- [ ] Infrastructure
  - [x] Unit Tests
  - [x] Served from AWS
  - [ ] Automated build and deployment


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```