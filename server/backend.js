const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", taskRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 5000");
});
