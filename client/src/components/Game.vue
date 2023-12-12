<template>
    <div v-if="start">
        <div class="userName">User: {{ user.name }}</div>
        <div class="country">Your country: {{ user.country }}</div>
        <div class="budget" model="user.budget">Your budget: €{{ user.budget }}</div>
        <div class="resource">Your Resource:</div>
        <table class="styled-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(quantity, item) in user.resource" :key="item">
                    <td>{{ item.charAt(0).toUpperCase() + item.slice(1) }}</td>
                    <td>{{ quantity }}</td>
                </tr>
            </tbody>
        </table>
        <hr>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Game",
    data() {
        return {
            start: false,
        }
    },
    mounted() {
        this.socket.on("initGame", (user) => {
            this.start = true
            this.updateUser(user)
        })
        this.socket.on("updateAll", (room) => {
            this.updateRoom(room)
        })
        this.socket.on("updateUser", (user) => {
            this.updateUser(user)
            
        })
    },
    methods: {
        ...mapMutations(["setUser", "setRoom"]),
        updateUser(user) {
            this.setUser(user)
        },
        updateRoom(room) {
            this.setRoom(room)
        }
    },
    computed: {
        ...mapState(["socket", "user", "room"])
    }
}
</script>

<style scoped>
.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    margin-top: 3px;
    font-size: 18px;
    min-width: 400px;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
.styled-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
}
.styled-table th,
.styled-table td {
    padding: 12px 15px;
}
.styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
}
.budget {
    margin: 10px 0;
    font-size: 25px;
    font-weight: bold;
}
.resource {
    margin: 10px 0;
    font-size: 25px;
    font-weight: bold;
}
.userName {
    margin: 10px 0;
    font-size: 25px;
    font-weight: bold;
}
.country {
    margin: 10px 0;
    font-size: 25px;
    font-weight: bold;
}
</style>