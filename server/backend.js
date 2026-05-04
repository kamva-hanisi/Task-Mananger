const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
let prod = "*"
if (process.env.NODE_ENV === "production"){
  prod = "https://task-mananger-client.onrender.com"
}

app.use(cors({origin: prod}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);
app.use("/", (req,res) =>{
  res.json({
    status: "healthy"
  });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
