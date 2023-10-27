const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const createError = require("http-errors");
const cors = require("cors");
const multer = require("multer");
const Grid = require("gridfs-stream");
// TODO: remove and uninstall unused imports
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const crypto = require("crypto");
// const mongodb = require("mongodb");
require("dotenv").config({ path: "./config.env" });
const routes = require("./routes/api");
const passport = require("passport");
const passportStrategy = require("./services/passport");
const { logger } = require("./services/logger");
const { GridFSBucket } = require("mongodb");
const websocket = require("./services/websocket");
// const https = require("https");
// const fs = require("fs");

const connect = mongoose
  .connect(process.env.ATLAS_URI ?? "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected...");

    const app = express();

    // Middleware to log requests in development mode
    if (process.env.NODE_ENV === "development") {
      app.use(logger);
    }

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

    // // Init stream
    // const conn = mongoose.connection;

    // // Init stream
    // const gfs = Grid(conn.db, mongoose.mongo);
    // gfs.collection("media");

    // const db = connect.db("test");

    app.use("/api", routes);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404, "Page Not Found"));
    });

    // error handler middleware
    app.use((err, req, res, next) => {
      const statusCode = err.statusCode || 500;
      console.error(err.statusCode, err.message, err.stack);
      res.status(statusCode).json({ success: false, message: err.message });

      return;
    });

    const port = process.env.PORT || 5000;

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

    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    websocket(server);
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));
