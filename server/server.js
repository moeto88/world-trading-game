const express = require("express")
// const path = require("path")
// const serveStatic = require("serve-static")
const app = express()
// app.use(serveStatic(__dirname + '/dist'))
const http = require("http")
const expServer = http.createServer(app)

const {Server} = require("socket.io")
const io = new Server(expServer, {
    cors: {
        origin: "http://localhost:8080"
    }
})

const rooms = []

const resource_A = {
    scissors: 2,
    ruler: 2,
    compass: 2,
    triangle: 1,
    paper: 100,
    colouredPaper: 0,
    glue: 0,
    pencil: 4
}

const resource_B = {
    scissors: 0,
    ruler: 0,
    compass: 0,
    triangle: 0,
    paper: 1000,
    colouredPaper: 100,
    glue: 1,
    pencil: 0
}

const resource_C = {
    scissors: 0,
    ruler: 0,
    compass: 0,
    triangle: 0,
    paper: 400,
    colouredPaper: 0,
    glue: 0,
    pencil: 2
}

const countryBudgetList = {
    "A": 600,
    "B": 200,
    "C": 0
}

const country_resource = {
    "A": resource_A,
    "B": resource_B,
    "C": resource_C
}

const rectangle_info = {
    costOfPaper: 15,
    costOfColouredPaper: 5,
    profit: 300
}
const triangle_info = {
    costOfPaper: 10,
    costOfColouredPaper: 5,
    profit: 150
}
const circle_info = {
    costOfPaper: 20,
    costOfColouredPaper: 5,
    profit: 500
}


io.on("connection", (socket) => {
    socket.on("resetGame", () => {
        console.log("Reset")
    })

    socket.on("createRoom", (userName) => {
        const roomId = generateRoomId()
        const user = {
            id: socket.id,
            name: userName,
            roomId: roomId,
            country: "",
            budget: 0,
            resource: {},
            tradeButtonFlag: false
        }
        const room = {
            id: roomId,
            users: [user],
        }
        rooms.push(room)
        socket.join(roomId)
        io.to(socket.id).emit("initUser", room, user)
        io.to(socket.id).emit("updateRoom", room)
    })

    socket.on("joinRoom", (userName, roomId) => {
        const roomIndex = rooms.findIndex((r) => r.id == roomId)
        if(roomIndex == -1) {
            io.to(socket.id).emit("notifyError", "Cannot find a room. Please enter a valid room ID again")
            return
        }

        const user = {
            id: socket.id,
            name: userName,
            roomId: roomId,
            country: "",
            budget: 0,
            resource: {},
            tradeButtonFlag: false
        }

        const room = rooms[roomIndex]
        room.users.push(user)
        socket.join(room.id)
        io.to(socket.id).emit("initUser", room, user)
        io.in(room.id).emit("updateRoom", room)
    })

    socket.on("startGame", (roomId, userId, country) => {
        if(country in countryBudgetList) {
            const roomIndex = rooms.findIndex((r) => r.id == roomId)
            const room = rooms[roomIndex]
            const user = room.users.find((u) => u.id == userId)
            user.country = country
            user.budget = countryBudgetList[user.country]
            user.resource = {...country_resource[user.country]}
            io.to(socket.id).emit("deleteError")
            io.to(socket.id).emit("initGame", user)
            io.in(roomId).emit("updateAll", room)
        }
        else {
            io.to(socket.id).emit("notifyError", "Please select your country")
        }
    })

    socket.on("createRectangle", (roomId, userId) => {
        const roomIndex = rooms.findIndex((r) => r.id == roomId)
        const room = rooms[roomIndex]
        const user = room.users.find((u) => u.id == userId)
        user.resource.paper = user.resource.paper - rectangle_info.costOfPaper
        user.budget = user.budget + rectangle_info.profit
        io.to(socket.id).emit("updateUser", user)
        io.in(roomId).emit("updateAll", room)
        io.to(socket.id).emit("announce", "You created rectangle. Earned: €" + rectangle_info.profit + ", Used: Paper " + rectangle_info.costOfPaper, true)
    })

    socket.on("createTriangle", (roomId, userId) => {
        const roomIndex = rooms.findIndex((r) => r.id == roomId)
        const room = rooms[roomIndex]
        const user = room.users.find((u) => u.id == userId)
        user.resource.paper = user.resource.paper - triangle_info.costOfPaper
        user.budget = user.budget + triangle_info.profit
        io.to(socket.id).emit("updateUser", user)
        io.in(roomId).emit("updateAll", room)
        io.to(socket.id).emit("announce", "You created triangle. Earned: €" + triangle_info.profit + ", Used: Paper " + triangle_info.costOfPaper, true)
    })

    socket.on("createCircle", (roomId, userId) => {
        const roomIndex = rooms.findIndex((r) => r.id == roomId)
        const room = rooms[roomIndex]
        const user = room.users.find((u) => u.id == userId)
        user.resource.paper = user.resource.paper - circle_info.costOfPaper
        user.budget = user.budget + circle_info.profit
        io.to(socket.id).emit("updateUser", user)
        io.in(roomId).emit("updateAll", room)
        io.to(socket.id).emit("announce", "You created circle. Earned: €" + circle_info.profit + ", Used: Paper " + circle_info.costOfPaper, true)
    })

    socket.on("createRectangle_colour", (roomId, userId) => {
        const roomIndex = rooms.findIndex((r) => r.id == roomId)
        const room = rooms[roomIndex]
        const user = room.users.find((u) => u.id == userId)
        user.resource.paper = user.resource.paper - rectangle_info.costOfPaper
        user.resource.colouredPaper = user.resource.colouredPaper - rectangle_info.costOfColouredPaper
        user.budget = user.budget + (rectangle_info.profit * 4)
        io.to(socket.id).emit("updateUser", user)
        io.in(roomId).emit("updateAll", room)
        io.to(socket.id).emit("announce", "You created coloured rectangle. Earned: €" + (rectangle_info.profit * 4) + ", Used: Paper " + rectangle_info.costOfPaper + ", Coloured Paper " + rectangle_info.costOfColouredPaper, true)
    })

    socket.on("createTriangle_colour", (roomId, userId) => {
        const roomIndex = rooms.findIndex((r) => r.id == roomId)
        const room = rooms[roomIndex]
        const user = room.users.find((u) => u.id == userId)
        user.resource.paper = user.resource.paper - triangle_info.costOfPaper
        user.resource.colouredPaper = user.resource.colouredPaper - triangle_info.costOfColouredPaper
        user.budget = user.budget + (triangle_info.profit * 4)
        io.to(socket.id).emit("updateUser", user)
        io.in(roomId).emit("updateAll", room)
        io.to(socket.id).emit("announce", "You created coloured triangle. Earned: €" + (triangle_info.profit * 4) + ", Used: Paper " + triangle_info.costOfPaper + ", Coloured Paper " + triangle_info.costOfColouredPaper, true)
    })

    socket.on("createCircle_colour", (roomId, userId) => {
        const roomIndex = rooms.findIndex((r) => r.id == roomId)
        const room = rooms[roomIndex]
        const user = room.users.find((u) => u.id == userId)
        user.resource.paper = user.resource.paper - circle_info.costOfPaper
        user.resource.colouredPaper = user.resource.colouredPaper - circle_info.costOfColouredPaper
        user.budget = user.budget + (circle_info.profit * 4)
        io.to(socket.id).emit("updateUser", user)
        io.in(roomId).emit("updateAll", room)
        io.to(socket.id).emit("announce", "You created coloured circle. Earned: €" + (circle_info.profit * 4) + ", Used: Paper " + circle_info.costOfPaper + ", Coloured Paper " + circle_info.costOfColouredPaper, true)
    })

    socket.on("askPartner", (userId, roomId, partnerName, item, quantity, budget_pay) => {
        const roomIndex = rooms.findIndex((r) => r.id == roomId)
        const room = rooms[roomIndex]
        const user = room.users.find((u) => u.id == userId)
        const partner = room.users.find(partner => partner.name == partnerName)
        const request = {
            tradingPartner: user.name,
            item: item,
            quantity: quantity,
            payment: budget_pay
        }
        io.to(partner.id).emit("request", request)
    })

    socket.on("acceptTradeRequest", (userId, roomId, partnerName, item, quantity, payment) => {
        const roomIndex = rooms.findIndex((r) => r.id == roomId)
        const room = rooms[roomIndex]
        const user = room.users.find((u) => u.id == userId)
        const partner = room.users.find((partner) => partner.name == partnerName)
        if(user.resource[item] >= quantity && partner.budget >= payment) {
            user.resource[item] = user.resource[item] - quantity
            user.budget = user.budget + payment
            partner.resource[item] = partner.resource[item] + quantity
            partner.budget = partner.budget - payment
            io.in(roomId).emit("updateAll", room)
            io.to(user.id).emit("updateUser", user)
            io.to(user.id).emit("announce", "You accepted the request from " + partnerName+ ". Received: €" + payment + ", Traded: " + item.charAt(0).toUpperCase() + item.slice(1) + " " + quantity, true)
            io.to(partner.id).emit("updateUser", partner)
            io.to(partner.id).emit("announce", "Your request was accepted by " + user.name + ". Received: " + item.charAt(0).toUpperCase() + item.slice(1) + " " + quantity + ", Paid: €" + payment, true)
        }
        else {
            if(user.resource[item] < quantity) {
                io.to(user.id).emit("announce", "Error: You didn't have enough resource. Resource: " + item.charAt(0).toUpperCase() + item.slice(1) + " " + quantity, false)
            }
            if(partner.budget < payment) {
                io.to(partner.id).emit("announce", "Error: You didn't have enough budget for trading. You need at least: €" + payment, false)
            }
        }
    })

    socket.on("refuseTradeRequest", (roomId, partnerName, item, quantity, payment) => {
        const roomIndex = rooms.findIndex((r) => r.id == roomId)
        const room = rooms[roomIndex]
        const partner = room.users.find((partner) => partner.name == partnerName)
        io.to(partner.id).emit("announce", "Your trade request was refused. Request: " + item.charAt(0).toUpperCase() + item.slice(1) + " " + quantity + ", Payment: €" + payment, false)
    })
})

// const PORT = process.env.PORT || 5000
const PORT = process.env.PORT || 3000
expServer.listen(PORT, () => {
    console.log("Listening at :3000...")
})

function generateRoomId() {
    const id = Math.floor(Math.random() * 8999 + 1000);
    if (rooms.some((r) => r.id == id)) {
        return generateRoomId();
    }
    return id;
}