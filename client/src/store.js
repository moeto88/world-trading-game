import { createStore } from 'vuex';

export default createStore({
    state: {
        socket: null,
        user: {},
        room: {}
    },
    mutations: {
        setSocket(state, socket) {
            state.socket = socket;
        },
        setUser(state, user) {
            state.user = user
        },
        setRoom(state, room) {
            state.room = room
        }
    },
    actions: {

    },
    getters: {
        
    },
});