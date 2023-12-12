<template>
    <div v-if="start">
        <h1>Production: </h1>
        <div class="container">
            <div class="shape-container">
                <img src="../assets/rectangle.png" />
                <input type="button" value="Create Rectangle" @click="createRectangle">
                <div>Need:</div>
                <ul>
                    <li>Scissors</li>
                    <li>Pencil</li>
                    <li>Ruler</li>
                    <li>Paper: 15</li>
                </ul>
                <input type="button" value="Create Rectangle with Coloured Paper" @click="createRectangle_colour">
                <div>+ Glue, ColouredPaper: 5</div>
                <div v-if="!resourceFlag" style="color: red;">{{ messageRect }}</div>
            </div>
            <div class="shape-container">
                <img src="../assets/triangle.png" />
                <input type="button" value="Create Triangle" @click="createTriangle">
                <div>Need:</div>
                <ul>
                    <li>Scissors</li>
                    <li>Pencil</li>
                    <li>Triangle</li>
                    <li>Paper: 10</li>
                </ul>
                <input type="button" value="Create Triangle with Coloured Paper" @click="createTriangle_colour">
                <div>+ Glue, ColouredPaper: 5</div>
                <div v-if="!resourceFlag" style="color: red;">{{ messageTri }}</div>
            </div>
            <div class="shape-container">
                <img src="../assets/circle.png" />
                <input type="button" value="Create Circle" @click="createCircle">
                <div>Need:</div>
                <ul>
                    <li>Scissors</li>
                    <li>Pencil</li>
                    <li>Compass</li>
                    <li>Paper: 20</li>
                </ul>
                <input type="button" value="Create Circle with Coloured Paper" @click="createCircle_colour">
                <div>+ Glue, ColouredPaper: 5</div>
                <div v-if="!resourceFlag" style="color: red;">{{ messageCirc }}</div>
            </div>
        </div>
        <hr>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Production",
    data() {
        return {
            start: false,
            resourceFlag: true,
            rectangle_info: {
                costOfPaper: 15,
                costOfColouredPaper: 5,
                profit: 300
            },
            triangle_info: {
                costOfPaper: 10,
                costOfColouredPaper: 5,
                profit: 150
            },
            circle_info: {
                costOfPaper: 20,
                costOfColouredPaper: 5,
                profit: 500
            },
            messageRect: "",
            messageTri: "",
            messageCirc: ""
        }
    },
    mounted() {
        this.socket.on("initGame", () => {
            this.start = true
        })
    },
    methods: {
        createRectangle() {
            const numOfScissors = this.user.resource.scissors
            const numOfPencil = this.user.resource.pencil
            const numOfRuler = this.user.resource.ruler
            const numOfPaper = this.user.resource.paper
            if(numOfScissors > 0 && numOfPencil > 0 && numOfRuler > 0 && numOfPaper >= this.rectangle_info.costOfPaper)
            {
                this.resourceFlag = true
                this.socket.emit("createRectangle", this.room.id, this.user.id)
            }
            else {
                let errorMsg = "You don't have enough: "
                if(numOfScissors == 0) {
                    errorMsg = errorMsg + "Scissors, "
                }
                if(numOfPencil == 0) {
                    errorMsg = errorMsg + "Pencil, "
                }
                if(numOfRuler == 0) {
                    errorMsg = errorMsg + "Ruler, "
                }
                if(numOfPaper < this.rectangle_info.costOfPaper) {
                    errorMsg = errorMsg + "Paper, "
                }
                this.resourceFlag = false
                errorMsg = errorMsg.slice(0, -2)
                this.messageRect = errorMsg
            }
        },

        createRectangle_colour() {
            const numOfScissors = this.user.resource.scissors
            const numOfPencil = this.user.resource.pencil
            const numOfRuler = this.user.resource.ruler
            const numOfPaper = this.user.resource.paper
            const numOfGlue = this.user.resource.glue
            const numOfColouredPaper = this.user.resource.colouredPaper
            if(numOfScissors > 0 && numOfPencil > 0 && numOfRuler > 0 && numOfPaper >= this.rectangle_info.costOfPaper && numOfGlue > 0 && numOfColouredPaper >= this.rectangle_info.costOfColouredPaper)
            {
                this.resourceFlag = true
                this.socket.emit("createRectangle_colour", this.room.id, this.user.id)
            }
            else {
                let errorMsg = "You don't have enough: "
                if(numOfScissors == 0) {
                    errorMsg = errorMsg + "Scissors, "
                }
                if(numOfPencil == 0) {
                    errorMsg = errorMsg + "Pencil, "
                }
                if(numOfRuler == 0) {
                    errorMsg = errorMsg + "Ruler, "
                }
                if(numOfPaper < this.rectangle_info.costOfPaper) {
                    errorMsg = errorMsg + "Paper, "
                }
                if(numOfGlue == 0) {
                    errorMsg = errorMsg + "Glue, "
                }
                if(numOfColouredPaper < this.rectangle_info.costOfColouredPaper) {
                    errorMsg = errorMsg + "Coloured Paper, "
                }
                this.resourceFlag = false
                errorMsg = errorMsg.slice(0, -2)
                this.messageRect = errorMsg
            }
        },
        
        createTriangle() {
            const numOfScissors = this.user.resource.scissors
            const numOfPencil = this.user.resource.pencil
            const numOfTriangle = this.user.resource.triangle
            const numOfPaper = this.user.resource.paper
            if(numOfScissors > 0 && numOfPencil > 0 && numOfTriangle > 0 && numOfPaper >= this.triangle_info.costOfPaper)
            {
                this.resourceFlag = true
                this.socket.emit("createTriangle", this.room.id, this.user.id)
            }
            else {
                let errorMsg = "You don't have enough: "
                if(numOfScissors == 0) {
                    errorMsg = errorMsg + "Scissors, "
                }
                if(numOfPencil == 0) {
                    errorMsg = errorMsg + "Pencil, "
                }
                if(numOfTriangle == 0) {
                    errorMsg = errorMsg + "Triangle, "
                }
                if(numOfPaper < this.triangle_info.costOfPaper) {
                    errorMsg = errorMsg + "Paper, "
                }
                this.resourceFlag = false
                errorMsg = errorMsg.slice(0, -2)
                this.messageTri = errorMsg
            } 
        },

        createTriangle_colour() {
            const numOfScissors = this.user.resource.scissors
            const numOfPencil = this.user.resource.pencil
            const numOfTriangle = this.user.resource.triangle
            const numOfPaper = this.user.resource.paper
            const numOfGlue = this.user.resource.glue
            const numOfColouredPaper = this.user.resource.colouredPaper
            if(numOfScissors > 0 && numOfPencil > 0 && numOfTriangle > 0 && numOfPaper >= this.triangle_info.costOfPaper && numOfGlue > 0 && numOfColouredPaper >= this.triangle_info.costOfColouredPaper)
            {
                this.resourceFlag = true
                this.socket.emit("createTriangle_colour", this.room.id, this.user.id)
            }
            else {
                let errorMsg = "You don't have enough: "
                if(numOfScissors == 0) {
                    errorMsg = errorMsg + "Scissors, "
                }
                if(numOfPencil == 0) {
                    errorMsg = errorMsg + "Pencil, "
                }
                if(numOfTriangle == 0) {
                    errorMsg = errorMsg + "Triangle, "
                }
                if(numOfPaper < this.triangle_info.costOfPaper) {
                    errorMsg = errorMsg + "Paper, "
                }
                if(numOfGlue == 0) {
                    errorMsg = errorMsg + "Glue, "
                }
                if(numOfColouredPaper < this.triangle_info.costOfColouredPaper) {
                    errorMsg = errorMsg + "Coloured Paper, "
                }
                this.resourceFlag = false
                errorMsg = errorMsg.slice(0, -2)
                this.messageTri = errorMsg
            } 
        },

        createCircle() {
            const numOfScissors = this.user.resource.scissors
            const numOfPencil = this.user.resource.pencil
            const numOfCompass = this.user.resource.compass
            const numOfPaper = this.user.resource.paper
            if(numOfScissors > 0 && numOfPencil > 0 && numOfCompass > 0 && numOfPaper >= this.circle_info.costOfPaper)
            {
                this.resourceFlag = true
                this.socket.emit("createCircle", this.room.id, this.user.id)
            }
            else {
                let errorMsg = "You don't have enough: "
                if(numOfScissors == 0) {
                    errorMsg = errorMsg + "Scissors, "
                }
                if(numOfPencil == 0) {
                    errorMsg = errorMsg + "Pencil, "
                }
                if(numOfCompass == 0) {
                    errorMsg = errorMsg + "Compass, "
                }
                if(numOfPaper < this.circle_info.costOfPaper) {
                    errorMsg = errorMsg + "Paper, "
                }
                this.resourceFlag = false
                errorMsg = errorMsg.slice(0, -2)
                this.messageCirc = errorMsg
            }
        },

        createCircle_colour() {
            const numOfScissors = this.user.resource.scissors
            const numOfPencil = this.user.resource.pencil
            const numOfCompass = this.user.resource.compass
            const numOfPaper = this.user.resource.paper
            const numOfGlue = this.user.resource.glue
            const numOfColouredPaper = this.user.resource.colouredPaper
            if(numOfScissors > 0 && numOfPencil > 0 && numOfCompass > 0 && numOfPaper >= this.circle_info.costOfPaper && numOfGlue > 0 && numOfColouredPaper >= this.circle_info.costOfColouredPaper)
            {
                this.resourceFlag = true
                this.socket.emit("createCircle_colour", this.room.id, this.user.id)
            }
            else {
                let errorMsg = "You don't have enough: "
                if(numOfScissors == 0) {
                    errorMsg = errorMsg + "Scissors, "
                }
                if(numOfPencil == 0) {
                    errorMsg = errorMsg + "Pencil, "
                }
                if(numOfCompass == 0) {
                    errorMsg = errorMsg + "Compass, "
                }
                if(numOfPaper < this.circle_info.costOfPaper) {
                    errorMsg = errorMsg + "Paper, "
                }
                if(numOfGlue == 0) {
                    errorMsg = errorMsg + "Glue, "
                }
                if(numOfColouredPaper < this.circle_info.costOfColouredPaper) {
                    errorMsg = errorMsg + "Coloured Paper, "
                }
                this.resourceFlag = false
                errorMsg = errorMsg.slice(0, -2)
                this.messageCirc = errorMsg
            }
        }
    },
    computed: {
        ...mapState(["socket", "user", "room"])
    }
}
</script>

<style scoped>
.container {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.shape-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}  
.shape-container img {
    width: 100px; /* 画像のサイズを適切に設定 */
    height: auto; /* アスペクト比を保持 */
    margin-bottom: 5px; /* 画像とボタンの間に余白を設定 */
}
.shape-container input[type="button"] {
    background-color: #4caf50; /* ボタンの背景色 */
    color: white; /* ボタンの文字色 */
    border: none; /* ボーダーをなしに設定 */
    padding: 10px 20px; /* パディングを設定 */
    cursor: pointer; /* カーソルをポインターに変更 */
    transition: background-color 0.3s; /* ホバー時のアニメーション */
    margin-top: 5px;
}
</style>