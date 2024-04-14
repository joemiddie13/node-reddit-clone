const Post = require('../models/post');
const User = require('../models/user');

module.exports = (app) => {
  // New Post Route
  app.get('/posts/new', (req, res) => {
    const currentUser = req.user;
    res.render('posts-new', { currentUser });
  });
  
  // CREATE
  app.post('/posts/new', async (req, res) => {
    if (req.user) {
      const userId = req.user._id;
      const post = new Post({
        title: req.body.title,
        url: req.body.url,
        summary: req.body.summary,
        subreddit: req.body.subreddit,
        author: userId,
      });

      try {
        const savedPost = await post.save();
        const user = await User.findById(userId);
        user.posts.unshift(savedPost);
        await user.save();
        return res.redirect(`/posts/${savedPost._id}`);
      } catch (err) {
        console.log(err);
      }
    } else {
      return res.status(401).send({ message: 'Unauthorized' });
    }
  });

  // INDEX
  app.get('/', async (req, res) => {
    try {
      const currentUser = req.user;
      const posts = await Post.find({}).lean().populate('author');
      return res.render('posts-index', { posts, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  });

  // SHOW POST
  app.get('/posts/:id', async (req, res) => {
    try {
      const currentUser = req.user;
      const post = await Post.findById(req.params.id)
        .lean()
        .populate('author')
        .populate({ path: 'comments', populate: { path: 'author' } });
      return res.render('posts-show', { post, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  });

  // SUBREDDIT
  app.get('/n/:subreddit', (req, res) => {
    const currentUser = req.user;
    Post.find({ subreddit: req.params.subreddit }).lean()
      .then((posts) => res.render('posts-index', { posts, currentUser }))
      .catch((err) => {
        console.log(err);
      });
  });
};