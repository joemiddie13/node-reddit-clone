const Post = require('../models/post');

module.exports = (app) => {
  // New Post Route
  app.get('/posts/new', (req, res) => {
    res.render('posts-new');
  });
  
  /// CREATE
  app.post('/posts/new', async (req, res) => {
    console.log('Received POST request to /posts/new');
    console.log('Request body:', req.body);

    try {
      const post = new Post(req.body);
      await post.save();
      console.log('Post saved successfully');
      res.redirect('/');
    } catch (err) {
      console.error('Error saving post:', err);
      res.status(500).send("Error saving the post.");
    }
  });

  // INDEX
  app.get('/', async (req, res) => {
    try {
      const posts = await Post.find({});
      res.render('home', { posts });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving posts.");
    }
  });
};