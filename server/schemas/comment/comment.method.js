
// like comment
module.exports.like = async function (userId, commentId) {
    const comment = await this.findById(commentId);
    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId);
      comment.likes_count += 1;
      return comment.save();
    } else {
      return;
    }
  };
  
  // unlike comment
  module.exports.unlike = async function (userId, commentId) {
    const comment = await this.findById(commentId);
  
    const likeIndex = comment.likes.indexOf(userId);
    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
      comment.likes_count -= 1;
      return comment.save();
    } else {
      return;
    }
  };