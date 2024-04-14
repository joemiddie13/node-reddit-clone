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
      const posts = await Post.find({}).lean();
      return res.render('posts-index', { posts });
    } catch (err) {
      console.log(err.message);
    }
  });

  // SHOW POST
  app.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).lean().populate('comments');
      res.render('posts-show', { post });
    } catch (err) {
      console.log(err.message);
    }
  });

  // SUBREDDIT
  app.get('/n/:subreddit', (req, res) => {
    Post.find({ subreddit: req.params.subreddit }).lean()
      .then((posts) => res.render('posts-index', { posts }))
      .catch((err) => {
        console.log(err);
      });
  });
};