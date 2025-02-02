import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;
const mongoose_uri = process.env.MONGODB_URI;

connectDB(mongoose_uri)
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`Server started at PORT:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed");
  });
