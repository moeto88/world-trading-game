<template>
    <div v-if="start">
        <h1>Announce</h1>
        <ul>
            <li v-for="announcement in announcementList" :key="announcement" :class="{ 'good-msg': announcement.msgGoodFlag, 'bad-msg': !announcement.msgGoodFlag }">
                {{ announcement.msg }}
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Announce",
    data() {
        return {
            start: false,
            announcementList: []
        }
    },
    mounted() {
        this.socket.on("initGame", () => {
            this.start = true
        })

        this.socket.on("announce", (msg, msgGoodFlag) => {
            const announcementInfo = {
                msg: msg,
                msgGoodFlag: msgGoodFlag
            }
            this.announcementList.push(announcementInfo)
        })
    },
    computed: {
        ...mapState(["socket", "user", "room"])
    }
}
</script>

<style scoped>
.good-msg {
    color: green;
    font-size: 20px;
    line-height: 1.5;
    margin-bottom: 8px;
}
.bad-msg {
    color: red;
    font-size: 20px;
    line-height: 1.5;
    margin-bottom: 8px;
}
</style>