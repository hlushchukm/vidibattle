const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const routes = require("./routes/api");
const passport = require("passport");
const passportStrategy = require("./services/passport");
// const https = require("https");
// const fs = require("fs");

const connect = mongoose
  .connect(process.env.ATLAS_URI ?? "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(
  session({
    secret: process.env.SESSION_SECRET || "twinphy",
    resave: false,
    store: MongoStore.create({ mongoUrl: process.env.ATLAS_URI ?? "" }),
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors()
  // TODO: configure cors
  // cors({
  //   origin: process.env.CLIENT_URL,
  //   methods: "GET,POST,PUT,DELETE",
  //   credentials: true,
  // })
);
app.use(express.json());
app.use("/api", routes);
app.use((err, req, res, next) => {
  console.log(err);
  next();
});

// https
//   .createServer(
//     // Provide the private and public key to the server by reading each
//     // file's content with the readFileSync() method.
//     {
//       key: fs.readFileSync("localhost-key.pem"),
//       cert: fs.readFileSync("localhost.pem"),
//     },
//     app
//   )
//   .listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
