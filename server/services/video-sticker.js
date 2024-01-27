const {
  addStickerToVideo,
  deleteFile,
  storeFileFromLocalToGridFS,
} = require("../controllers/media.controller");

module.exports.processVideo = async (job) => {
  try {
    console.log(`Processing video job ${job.attrs._id}`);

    const { data } = job.attrs;
    if (!data) {
      console.log("data for processing video not found");
      return;
    }

    const { file, sticker } = data;
    // add sticker to video and save to temp folder
    const filePath = await addStickerToVideo(file?.filename, sticker);

    // delete old video file(the uploaded file)
    await deleteFile(file?.filename);

    // upload the new video with the sticker from temp folder
    await storeFileFromLocalToGridFS(filePath, file.filename, file.contentType);

    console.log(`Video job ${job.attrs._id} completed`);
  } catch (error) {
    console.error(`Error processing video job ${job.attrs._id}:`, error);
  }
};
