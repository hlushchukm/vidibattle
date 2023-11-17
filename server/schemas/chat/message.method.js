module.exports.chatList = function ({
  chatId,
  lastDate,
  lastMessageId,
  pageSize,
}) {
  let query = { chat_id: chatId };

  if (lastDate) {
    query.$or = [
      { createdAt: { $lt: new Date(lastDate) } },
      {
        $and: [
          { createdAt: new Date(lastDate) },
          { _id: { $lt: new mongoose.Types.ObjectId(lastMessageId) } },
        ],
      },
    ];
  }

  return this.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(parseInt(pageSize))
    .populate("receiver", "first_name last_name profile_img username")
    .populate("sender", "first_name last_name profile_img username");
};
