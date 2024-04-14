const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = (app) => {
  // CREATE Comment
  app.post('/posts/:postId/comments', async (req, res) => {
    try {
      // INSTANTIATE INSTANCE OF MODEL
      const comment = new Comment(req.body);

      // SAVE INSTANCE OF Comment MODEL TO DB
      await comment.save();

      // FIND PARENT POST
      const post = await Post.findById(req.params.postId);

      // ADD COMMENT TO PARENT POST
      post.comments.unshift(comment);
      await post.save();

      // REDIRECT TO PARENT POST
      res.redirect(`/posts/${post._id}`);
    } catch (err) {
      console.log(err);
    }
  });
};