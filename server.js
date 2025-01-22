import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
const score = []
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id)

  socket.on("add_player", (msg) => {
    console.log("Message received:", msg)
    io.emit("add_player", msg)
  })
  socket.on("hit", (msg) => {
    console.log("hit achieved by:", msg)
    io.emit("hit", msg)
  })
  socket.on("signal", (data) => {
    io.to(data.to).emit("signal", { from: socket.id, signal: data.signal })
  })
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// Start the server
// const PORT = 4000
// server.listen(PORT, () => {
//   console.log(`Socket.IO server running on http://localhost:${PORT}`)
// })
const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})
