const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = (app) => {
  // CREATE Comment
  app.post('/posts/:postId/comments', async (req, res) => {
    try {
      const comment = new Comment({
        content: req.body.content,
        author: req.user._id,
      });
      await comment.save();

      const post = await Post.findById(req.params.postId);
      post.comments.unshift(comment);
      await post.save();

      res.redirect(`/posts/${req.params.postId}`);
    } catch (err) {
      console.log(err);
    }
  });
};