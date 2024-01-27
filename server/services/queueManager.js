const Agenda = require("agenda");
const { processVideo } = require("./video-sticker");

let agenda;
module.exports.setupAgenda = async (mongoose) => {
  // setup agenda for processing videos in the background
  agenda = new Agenda({ mongo: mongoose.connection });
  agenda.define("process video", { priority: "high", concurrency: 3 }, (job) =>
    processVideo(job)
  );

  await startAgenda(agenda);
};

const startAgenda = async (agenda) => {
  await agenda.start();
  console.log("Agenda scheduler started");
};

// Add a job to the queue
module.exports.scheduleTask = (data) => {
  if (!agenda) {
    console.log("Agenda not found");
    return;
  }
  agenda.now("process video", data);
};
