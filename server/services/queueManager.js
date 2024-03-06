const Agenda = require("agenda");
const { processVideo } = require("./videoSticker");
const { Post } = require("../models/post.model");

let agenda;

module.exports.setupAgenda = async (mongoose) => {
  // setup agenda for processing videos in the background
  agenda = new Agenda({ mongo: mongoose.connection });

  // define a video processing (adding sticker) job
  videoStickerJob(agenda);

  // Define the cleanup job to remove old jobs from database
  cleanupJob(agenda);

  await startAgenda(agenda);
};

const startAgenda = async (agenda) => {
  await agenda.start();
  console.log("Agenda scheduler started");
};

// Add a job to the queue
module.exports.scheduleVideoTask = (data, time = "now") => {
  if (!agenda) {
    console.log("Agenda not found");
    return;
  }

  if (time === "now") agenda.now("process video", data);
  else agenda.schedule(time, "process video", data);
};

const videoStickerJob = (agenda) => {
  agenda.define("process video", { priority: "high", concurrency: 2 }, (job) =>
    processVideo(job, agenda)
  );
};

const cleanupJob = (agenda) => {
  agenda.define("cleanupJob", async (job) => {
    // Remove completed jobs older than 30 days
    console.log("running agenda cleanup job");
    const thirtyDaysAgo = new Date(Date.now() - 0 * 24 * 60 * 60 * 1000);
    await agenda.cancel({ lastFinishedAt: { $lt: thirtyDaysAgo } });
  });

  // Schedule the cleanup job to run every day at midnight
  agenda.every("0 0 * * *", "cleanupJob");
};

module.exports.scheduleUnpaidJob = () => {
  if (!agenda) {
    console.log("Agenda not found");
    return;
  }

  agenda.define("unpaidJob", async (job) => {
    // Remove completed jobs older than 30 days
    console.log("running agenda unpaid job");
    await Post.deleteMany({});
    console.log("deleted all posts.");
  });

  // Schedule the unpaid job to run every day at midnight
  agenda.every("0 0 * * *", "unpaidJob");
};

module.exports.clearUnpaidJob = async () => {
  const numRemoved = await agenda.cancel({ name: "unpaidJob" });

  console.log(`cancelled ${numRemoved} unpaid job(s).`);
};
