const Agenda = require("agenda");
const { addStickerToVideo } = require("./video-sticker");

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

const processVideo = async (job) => {
  try {
    const { postId } = job.attrs.data;
    // Perform video processing logic
    console.log(`Processing video job ${postId}`);

    // Simulate asynchronous processing
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log(`Video job ${postId} completed`);
  } catch (error) {
    console.error(`Error processing video job ${postId}:`, error);
  }
};
