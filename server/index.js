var express = require('express');
var bodyParser = require('body-parser');
var request = require('request')
var app = express();

//Helpers
var apiHelpers = require('./helpers/apiHelpers.js');

//Middleware
app.use(bodyParser.json());

// Due to express, when you load the page, it doesn't make a get request to '/', it simply serves up the dist folder
app.use(express.static(__dirname + '/../client/dist'));


//OPTION 1: Use regular routes
app.get('/search', function(req, res) {
  getMoviesByGenre(req.query)
      .then(results => res.status(200).send(results.data))
      .catch(err => res.status(500).send('server error - please try again later!'));
});

app.get('/favorites', function(req, res) {
  getAllFavorites((err, docs) => {
      if (err) {
          res.status(500).send('server error - please try again later!');
      } else {
          res.status(200).send(docs);
      }
  });
});

app.get('/genres', function(req, res) {
  getGenres()
      .then(results => res.status(200).send(results.data))
      .catch(err => res.status(500).send('server error - please try again later!'));
});

app.post('/save', function(req, res) {
  saveFavorite(req.body.data.movie, (err, success) => {
      if (err) {
          res.status(500).send('err: ', err);
      } else {
          res.status(200).send('Movie saved successfully!');
      }
  });
});

app.post('/delete', function(req, res) {
  let movieID = req.body.data.id;
  deleteFavorite(movieID, (err, success) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.status(201).send('Movie successfully removed from favorites.');
      }
  });
});

//OPTION 2: Use Express Router
//IF you decide to go with this option delete OPTION 1 to continue
//Routes
const movieRoutes = require('./routes/movieRoutes.js');
//Use routes
app.use('/movies', movieRoutes);


app.listen(3000, function() {
  console.log('listening on port 3000!');
});
