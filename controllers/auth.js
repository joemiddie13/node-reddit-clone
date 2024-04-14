const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (app) => {
  // SIGN UP FORM
  app.get('/sign-up', (req, res) => res.render('sign-up'));

  // SIGN UP POST
  app.post('/sign-up', async (req, res) => {
    try {
      // Create User
      const user = new User(req.body);
      await user.save();

      // Create JWT token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });

      return res.redirect('/');
    } catch (err) {
      console.log(err.message);
      return res.status(400).send({ err });
    }
  });
  // LOGIN FORM
  app.get('/login', (req, res) => res.render('login'));

  // LOGIN POST
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      // Find user by username
      const user = await User.findOne({ username }).select('+password');
      if (!user) {
        return res.status(401).send({ message: 'Wrong Username or Password' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).send({ message: 'Wrong Username or password' });
      }

      // Create JWT token
      const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
        expiresIn: '60 days',
      });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });

      return res.redirect('/');
    } catch (err) {
      console.log(err);
    }
  });

  // LOGOUT
  app.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    return res.redirect('/');
  });
};