const {
  addStickerToVideo,
  deleteFile,
  storeFileFromLocalToGridFS,
} = require("../controllers/media.controller");

const maxRetryAmount = 3;

module.exports.processVideo = async (job, agenda) => {
  const { data } = job.attrs;
  if (!data) {
    console.log("data for processing video not found");
    return;
  }

  const { file, sticker, retry } = data;

  try {
    console.log(`Processing video job ${job.attrs._id}`);

    // add sticker to video and save to temp folder
    const filePath = await addStickerToVideo(file?.filename, sticker);

    // delete old video file(the uploaded file)
    await deleteFile(file?.filename);

    // upload the new video with the sticker from temp folder
    await storeFileFromLocalToGridFS(filePath, file.filename, file.contentType);

    console.log(`Video job ${job.attrs._id} completed`);
  } catch (error) {
    console.error(`Error processing video job ${job.attrs._id}:`, error);

    // reschedule agenda
    if (!retry || retry < maxRetryAmount) {
      const newRetryAmount = retry ? retry + 1 : 1;
      agenda.schedule("in 1 minute", "process video", {
        ...data,
        retry: newRetryAmount,
        error: error.toString(),
      });
      console.log(
        `rescheduling video processing ${job.attrs._id}. retry: ${newRetryAmount}`
      );
    }
  }
};
