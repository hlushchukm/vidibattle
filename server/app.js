const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const createError = require("http-errors");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config({ path: "./config.env" });
const routes = require("./routes/api");
const passport = require("passport");
const passportStrategy = require("./services/passport");
const { logger } = require("./services/logger");
const websocket = require("./services/websocket");
const {
  updateCompetitionStartsForToday,
  updateCompetitionEndsForToday,
} = require("./controllers/competition.controller");
// const https = require("https");
// const fs = require("fs");
const { setupAgenda } = require("./services/queueManager");
const { checkAdminAccount } = require("./services/admin");

const connect = mongoose
  .connect(process.env.ATLAS_URI ?? "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((m) => {
    console.log("MongoDB Connected...");

    const app = express();

    // logging middleware
    app.use(logger);

    // middlewares
    app.set("trust proxy", 1);

    const sessionMiddleware = (cookieName) =>
      session({
        name: cookieName,
        secret: process.env.SESSION_SECRET || "vidibattle",
        resave: false,
        store: MongoStore.create({ mongoUrl: process.env.ATLAS_URI ?? "" }),
        saveUninitialized: true,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 3, // 1000ms * 60s * 60min * 24hrs * 3 = 3 days,
          secure: process.env.NODE_ENV === "development" ? false : true,
          sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        },
      });

    app.use("/api", sessionMiddleware("userSession"));
    app.use("/api", passport.initialize());
    app.use("/api", passport.session());

    app.use("/admin/api", sessionMiddleware("adminSession"));
    app.use("/admin/api", passport.initialize());
    app.use("/admin/api", passport.session());

    app.use(
      cors({
        origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
      })
    );
    app.use(express.json());

    app.use("/api", routes);
    app.use("/admin/api", routes);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404, "Page Not Found"));
    });

    // error handler middleware
    app.use((err, req, res, next) => {
      const statusCode = err.statusCode || 500;
      console.error(
        err.statusCode,
        err.message,
        statusCode === 404 ? "" : err.stack
      );
      res.status(statusCode).json({ success: false, message: err.message });

      return;
    });

    // Schedule the cron job to run every hour
    cron.schedule("0 * * * *", async () => {
      await updateCompetitionStartsForToday();
      await updateCompetitionEndsForToday();
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
      runOnServerStart(m);
    });

    websocket(server);
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));

// functions to run on server start
const runOnServerStart = async (m) => {
  updateCompetitions();
  setupAgenda(m);
  checkAdminAccount();
};

const updateCompetitions = async () => {
  await updateCompetitionStartsForToday();
  await updateCompetitionEndsForToday();
};
