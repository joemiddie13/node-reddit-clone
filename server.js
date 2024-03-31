const express = require('express');
const app = express();
const port = 3000;

// Set up Handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// HOME Route
app.get('/', (req, res) => {
  res.render('home');
});