<template>
  <h1>World Trading Game</h1>
  <Room />
  <Game />
  <Production />
  <Trade />
  <Announce />
</template>

<script>
import Room from './components/Room.vue'
import Game from "./components/Game.vue"
import Production from "./components/Production.vue"
import Trade from "./components/Trade.vue"
import Announce from "./components/Announce.vue"
import { io } from "socket.io-client"
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  components: {
    Room,
    Game,
    Production,
    Trade,
    Announce
  },
  created() {
    const socket = io("http://localhost:3000")
    this.setSocket(socket)
  },
  computed: {
  },
  methods: {
    ...mapMutations(["setSocket"])
  }
}
</script>

<style>

</style>
