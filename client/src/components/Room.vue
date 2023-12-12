<template>
  <div class="container">
    <div class="name-input" v-if="isJoined">
      <label for="userName"> User Name: {{ userName }}</label>
      <div>Room ID: {{ roomId }}</div>
      <div class="room-members">
        <div>Room Members: </div>
        <ul>
          <li v-for="user in userList" :key="user">{{ user }}</li>
        </ul>
      </div>
      <div v-if="!start">
        <div>Select Your Country</div>
        <div class="radio-buttons">
          <label>
            <input type="radio" v-model="country" value="A"> A
          </label>
          <label>
            <input type="radio" v-model="country" value="B"> B
          </label>
        </div>
        <div>
          <input type="button" value="Start Game" @click="startGame">
        </div>
      </div>
    </div>
    
    <div v-else>
      <div class="input-section">
        Name:
        <input v-model="userName" type="text">
      </div>
      <div class="radio-section">
        <input type="radio" v-model="joinType" value="1"> Create Room
        <input type="radio" v-model="joinType" value="2"> Join Room
      </div>
      <div class="create-room-button" v-if="joinType == 1">
        <input type="button" value="Create Room" @click="createRoom">
      </div>
      <div class="join-room-section" v-if="joinType == 2">
        Room ID: <input v-model="roomId" type="text">
        <input class="join-room-button" type="button" value="Join Room" @click="joinRoom">
      </div>
    </div>
    <div class="error-message">{{ error_message }}</div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Room',
  data() {
    return {
      error_message: "",
      userName: "",
      userId: "",
      joinType: 1,
      roomId: "",
      isJoined: false,
      userList: [],
      country: "",
      start: false
    }
  },
  created() {
    this.socket.on("connect", () => {
      console.log("connected")
    })
  },
  mounted() {
    this.socket.on("initUser", (room, user) => {
      this.isJoined = true
      this.roomId = room.id
      this.userId = user.id
      this.updateUser(user)
      this.updateRoom(room)
    })
    this.socket.on("updateRoom", (room) => {
      this.userList = room.users.map(user => user.name)
      this.updateRoom(room)
    })
    this.socket.on("notifyError", (error) => {
      this.start = false
      this.error_message = error
    })
    this.socket.on("deleteError", () => {
      this.error_message = ""
    })
  },
  methods: {
    ...mapMutations(["setUser", "setRoom"]),

    createRoom() {
      this.socket.emit("createRoom", this.userName)
      this.error_message = ""
    },
    joinRoom() {
      this.socket.emit("joinRoom", this.userName, this.roomId)
      this.error_message = ""
    },
    startGame() {
      this.start = true
      this.socket.emit("startGame", this.roomId, this.userId, this.country)
    },
    updateUser(user) {
      this.setUser(user)
    },
    updateRoom(room) {
      this.setRoom(room)
    }
  },
  computed: {
    ...mapState(["socket", "user"]),
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  max-width: 600px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.name-input {
  margin-bottom: 20px;
}
.name-input label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.name-input input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.room-members {
  margin-top: 10px;
}
.radio-buttons {
  display: flex;
  gap: 10px;
}
.radio-buttons label {
  display: flex;
  align-items: center;
}
input[type="button"] {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}
input[type="button"]:hover {
  background-color: #45a049;
}
.error-message {
  color: red;
  margin-top: 10px;
}
.input-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  font-size: 20px;
}
.input-section input {
  flex-grow: 0.1; 
  margin-left: 10px;
}
.radio-section {
  margin-bottom: 20px;
}
.create-room-button {
  margin-top: 10px; 
}
.join-room-section {
  margin-top: 10px;
}
.join-room-button {
  margin-left: 10px;
}
</style>
