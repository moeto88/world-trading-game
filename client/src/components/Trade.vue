<template>
    <div v-if="start">
        <h1>Trade: </h1>
        <div v-for="partner in room.users" :key="partner">
            <div class="trade-container" v-if="partner.name !== user.name">
                <div class="partner">{{ partner.name }}</div>
                <input class="tradeButton" type="button" value="Trade" @click="trade(partner.name)">
                <div v-if="partner.tradeButtonFlag">
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Ask</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(quantity, item) in partner.resource" :key="item">
                                <td>{{ item.charAt(0).toUpperCase() + item.slice(1) }}</td>
                                <td>{{ quantity }}</td>
                                <td class="ask-column">
                                    <div class="ask-row">
                                        <span>Quantity:&nbsp;</span>
                                        <input type="number" v-model="ask_resource_quantity[item]">
                                    </div>
                                    <div class="ask-row">
                                        <span>Budget: €</span>
                                        <input type="number" v-model="budget_pay[item]">
                                    </div>
                                    <input class="ask-button" type="button" value="Ask" @click="askPartner(partner.name, item, quantity)">
                                    <div style="color: red; margin-bottom: 3px;">{{ ask_resource_error[item] }}</div>
                                    <div style="color: red; margin-bottom: 3px;">{{ budget_error[item] }}</div>
                                    <div style="color: green; margin-bottom: 3px;">{{ request_sent[item] }}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <hr>
        <h1>Trade Request:</h1>
        <div id="trade-request-container">
            <div class="trade-request" v-for="request in trade_requests" :key="request">
                <div class="trading-partner">{{ request.tradingPartner }}</div>
                <div class="ask-pay">Trade: {{ request.item.charAt(0).toUpperCase() + request.item.slice(1) }}  {{ request.quantity }}</div>
                <div class="ask-pay">Payment: €{{ request.payment }}</div>
                <input class="accept-button" type="button" value="Accept" @click="accept(request.tradingPartner, request.item, request.quantity, request.payment)">
                <input class="refuse-button" type="button" value="Refuse" @click="refuse(request.tradingPartner, request.item, request.quantity, request.payment)">
            </div>
        </div>
        <hr>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Trade",
    data() {
        return {
            start: false,
            ask_resource_quantity: {
                scissors: 0,
                ruler: 0,
                compass: 0,
                triangle: 0,
                paper: 0,
                colouredPaper: 0,
                glue: 0,
                pencil: 0
            },
            ask_resource_error: {
                scissors: "",
                ruler: "",
                compass: "",
                triangle: "",
                paper: "",
                colouredPaper: "",
                glue: "",
                pencil: ""
            },
            budget_pay: {
                scissors: 0,
                ruler: 0,
                compass: 0,
                triangle: 0,
                paper: 0,
                colouredPaper: 0,
                glue: 0,
                pencil: 0
            },
            budget_error: {
                scissors: "",
                ruler: "",
                compass: "",
                triangle: "",
                paper: "",
                colouredPaper: "",
                glue: "",
                pencil: ""
            },
            trade_requests: [],
            request_sent: {
                scissors: "",
                ruler: "",
                compass: "",
                triangle: "",
                paper: "",
                colouredPaper: "",
                glue: "",
                pencil: ""
            },
        }
    },
    methods: {
        trade(partnerName) {
            const partner = this.room.users.find(partner => partner.name === partnerName);
            if (partner) {
                partner.tradeButtonFlag = !partner.tradeButtonFlag
            }   
        },
        askPartner(partnerName, item, max) {
            let flag1 = true
            let flag2 = true
            this.ask_resource_error = this.initMessageLists(this.ask_resource_error)
            this.budget_error = this.initMessageLists(this.budget_error)
            this.request_sent = this.initMessageLists(this.request_sent)

            if(this.ask_resource_quantity[item] > max || this.ask_resource_quantity[item] <= 0) {
                this.ask_resource_error[item] = "Please enter a valid number: 1 ~ " + max
                this.ask_resource_quantity[item] = 0
                flag1 = false
            }

            if(this.budget_pay[item] > this.user.budget) {
                this.budget_error[item] = "You don't have enough budget"
                this.budget_pay[item] = 0
                flag2 = false
            }

            if(flag1 && flag2) {
                this.socket.emit("askPartner", this.user.id, this.room.id, partnerName, item, this.ask_resource_quantity[item], this.budget_pay[item])
                this.ask_resource_quantity[item] = 0
                this.budget_pay[item] = 0
                this.request_sent[item] = "Your request was sent to " + partnerName
            }
            
        },
        accept(tradingPartner, item, quantity, payment) {
            const requestIndex = this.trade_requests.findIndex((req) => req.tradingPartner == tradingPartner)
            this.trade_requests.splice(requestIndex, 1)
            this.socket.emit("acceptTradeRequest", this.user.id, this.room.id, tradingPartner, item, quantity, payment)
        },
        refuse(tradingPartner, item, quantity, payment) {
            const requestIndex = this.trade_requests.findIndex((req) => req.tradingPartner == tradingPartner)
            this.trade_requests.splice(requestIndex, 1)
            this.socket.emit("refuseTradeRequest", this.room.id, tradingPartner, item, quantity, payment)
        },
        initMessageLists(list) {
            for(const key in list) {
                list[key] = ""
            }
            return list
        }
    },
    mounted() {
        this.socket.on("initGame", () => {
            this.start = true
        })

        this.socket.on("request", (request) => {
            this.trade_requests.push(request)
            
        })
    },
    computed: {
        ...mapState(["socket", "user", "room"])
    }
}
</script>

<style scoped>
.trade-container {
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-bottom: 10px;
}
.partner {
    display: inline-block;
    font-size: 25px; 
    margin-right: 10px; 
}
.tradeButton {
    font-size: 16px; 
    padding: 6px 10px; 
    cursor: pointer;
}
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
.ask-column {
    display: flex;
    flex-direction: column;
    margin-bottom: 0px;
}
.ask-row {
    display: flex;
    flex-direction: row;
    margin-top: 2px;
    margin-bottom: 5px;
}
.styled-table td input[type="button"] {
    cursor: pointer;
}
.styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
}
input[type="number"] {
    width: 40px;
}
#trade-request-container {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
}
.trade-request {
    border: 2px solid #333;
    border-radius: 8px;
    padding: 7px;
    margin-bottom: 10px;
    width: 300px;
    text-align: center;
}
.trade-request .trading-partner {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 8px;
}
.trade-request .ask-pay {
    margin-bottom: 8px;
    font-size: 25px;
}
.trade-request button {
    padding: 8px 16px;
    margin: 4px;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    font-weight: bold;
}
.trade-request .accept-button {
    background-color: #4CAF50; /* Green */
    color: white;
    margin-right: 3px;
    cursor: pointer;
}
.trade-request .refuse-button {
    background-color: #f44336; /* Red */
    color: white;
    margin-left: 3px;
    cursor: pointer;
}

</style>