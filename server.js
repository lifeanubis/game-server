// server.js
import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app) // Create an HTTP server
const score = []
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id)

  // Listen for a "message" event from the client
  socket.on("message", (msg) => {
    console.log("Message received:", msg)
    io.emit("message", msg) // Broadcast the message to all connected clients
  })
  socket.on("hit", (msg) => {
    console.log("hit achieved by:", msg)
    // calculateScore(msg)
    io.emit("hit", msg) // Broadcast the message to all connected clients
  })
  socket.on("signal", (data) => {
    io.to(data.to).emit("signal", { from: socket.id, signal: data.signal })
  })
  // Handle client disconnections
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
