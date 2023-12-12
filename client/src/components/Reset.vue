<template>
    <div class="reset-container">
        <h3>Reset Game</h3>
        <input class="reset-button" type="button" value="Reset Game" @click="resetGame">
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Reset",
    data() {
        return {
            
        }
    },
    methods: {
        resetGame() {
            this.socket.emit("resetGame")
        }
    },
    computed: {
        ...mapState(["socket"])
    }
}
</script>

<style scoped>
.reset-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
h3 {
    margin-right: 10px;
    font-size: 18px; 
}
.reset-button {
    background-color: #ff5252; 
    color: white;
    border: none;
    padding: 12px 20px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}
.reset-button:hover {
    background-color: #d60000;
}
</style>