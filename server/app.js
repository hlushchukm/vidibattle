const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/api");
require("dotenv").config({ path: "./config.env" });

const cors = require("cors");

const connect = mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
