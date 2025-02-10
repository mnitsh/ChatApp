import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app, server, io, userSocketMap } from "./app.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;
const mongoose_uri = process.env.MONGODB_URI;

connectDB(mongoose_uri)
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });
    server.listen(PORT, () => {
      console.log(`Server started at PORT:${PORT}`);
    });

    io.on("connection", (socket) => {
      console.log("A user connected...", socket.id);
      const userId = socket.handshake.query.userId;
      if (userId) {
        userSocketMap[userId] = socket.id;
      }

      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
      });
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed", error.message);
  });
