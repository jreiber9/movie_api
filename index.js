const express = require('express'),  
  morgan = require('morgan'),
  fs = require('fs'), // import built in node modules fs and path 
  path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
  
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// morgan, express, body-parser
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // user data
// let users= [
//   {
//       id: 1,
//       name: 'Bill',
//       favoriteMovies: []
//   },

//   {
//       id: 2,
//       name: 'Lauren',
//       favoriteMovies: ["Interstellar"]
//   },

//   {
//       id: 3,
//       name: 'Tobias',
//       favoriteMovies: []
//   },
    
// ]

// // top movie data
// let movies = [
//   {
//     Title: 'Star Wars',
//     Genre: {
//         Name: 'Adventure',
//         Description: 'Implies a narrative that is defined by a journey (often including some form of pursuit) and is usually located within a fantasy or exoticized setting.'
//     },
//     Description: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empires world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.',
//     Director: {
//         Name: 'George Lucas',
//         born: 'May 4th, 1944',
//         bio: 'George Walton Lucas, Jr. is an American film director, producer, and screenwriter.'

//     }
//   },

//   {
//     Title: 'Indiana Jones and the Raiders of the Lost Ark',
//     Genre: {
//         Name: 'Adventure',
//         Description: 'Implies a narrative that is defined by a journey (often including some form of pursuit) and is usually located within a fantasy or exoticized setting.'
//     },
//     Description: 'In 1936, archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before the Nazis can obtain its awesome powers.',
//     Director: {
//         Name: 'Steven Spielberg',
//         born: 'December 18th, 1946',
//         bio: 'Steven Spielberg is an American film director, producer, and screenwriter.'

//     }
//   },

//   {
//     Title: 'Interstellar',
//     Genre: {
//         Name: 'Sci-Fi',
//         Description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, mutants, interstellar travel, time travel, or other technologies.'
//     },
//     Description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
//     Director: {
//         Name: 'Christopher Nolan',
//         born: 'July 30th, 1970',
//         bio: 'Christopher Nolan is an American film director, producer, and screenwriter.'

//     }
//   },

//   ];

// CREATE Mongoose
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// READ 
// Get all users Mondgoose
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ 
// Get all Movies Mongoose
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// READ
// Get a user by username Mongoose
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ
// Get a single movie Mongoose
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ
// Get movies by Genre Mongoose
app.get('/movies/genre/:genreName', (req, res) => {
  Movies.find({ 'Genre.Name': req.params.genreName })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ
// Get Director Data Mongoose
app.get('/movies/director/:Director', (req, res) => {
  Movies.find({ 'Director.Name': req.params.Director })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// UPDATE
// Update a user's info, by username Mongoose
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
  { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    },
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((user) => {
    if (!user) {
      return res.status(400).send('Error: No user was found');
    } else { res.json(user);}
    })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
});


// CREATE Mongoose
// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }// This line makes sure that the updated document is returned
  )
  .then((updatedUser) => {
    if (!updatedUser) {
      return res.status(404).send("Error: User doesn't exist");
    } else {
      res.json(updatedUser);
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: '+ error);
  });
});


// DELETE
// Delete a movie from user's list of favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }// This line makes sure that the updated document is returned
  )
  .then((updatedUser) => {
    if (!updatedUser) {
      return res.status(404).send("Error: User doesn't exist");
    } else {
      res.json(updatedUser);
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: '+ error);
  });
});

// DELETE
// Delete a user by username(deregister) Mongoose
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Legacy CRUD starts

// UPDATE legacy
// app.put('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;

//   let user = users.find( user => user.id == id);

//   if (user) {
//       user.name = updatedUser.name;
//       res.status(200).json(user);
//   } else {
//       res.status(400).send('users need names')
//   }
// });

// // CREATE legacy
// app.post('/users/:id/:movieTitle', (req, res) => {
//   const { id, movieTitle } = req.params;

//   let user = users.find( user => user.id == id);

//   if (user) {
//       user.favoriteMovies.push(movieTitle);
//       res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);;
//   } else {
//       res.status(400).send('no such user')
//   }
// });

// // DELETE legacy
// app.delete('/users/:id/:movieTitle', (req, res) => {
//   const { id, movieTitle } = req.params;

//   let user = users.find( user => user.id == id);

//   if (user) {
//       user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
//       res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
//   } else {
//       res.status(400).send('no such user')
//   }
// });

// // DELETE legacy
// app.delete('/users/:id', (req, res) => {
//   const { id, movieTitle } = req.params;

//   let user = users.find( user => user.id == id);

//   if (user) {
//       user= users.filter( user => user.id != id);
//       res.status(200).send(`user ${id} has been deleted`);
//   } else {
//       res.status(400).send('no such user')
//   }
// });

// // READ legacy
// app.get('/movies', (req,res) => {
//   res.status(200).json(movies);
// });

// // READ legacy
// app.get('/movies/:title', (req,res) => {
//   const { title } = req.params;
//   const movie = movies.find( movie => movie.Title === title );

//   if (movie) {
//     res.status(200).json(movie);
//   } else {
//       res.status(400).send('no such movie')
//   }

// });

// // READ legacy
// app.get('/movies/genre/:genreName', (req,res) => {
//   const { genreName } = req.params;
//   const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

//   if (genre) {
//     res.status(200).json(genre);
//   } else {
//       res.status(400).send('no such genre')
//   }

// });

// // READ legacy
// app.get('/movies/director/:directorName', (req,res) => {
//   const { directorName } = req.params;
//   const director = movies.find( movie => movie.Director.Name === directorName ).Director;

//   if (director) {
//     res.status(200).json(director);
//   } else {
//       res.status(400).send('no such director')
//   }

// });

// Legacy CRUD ends


  // serving static files
  app.use(express.static('public'));
  
  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to myFlix!!!');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  app.get('/movies', (req, res) => {
    res.json(movies);
  });

  // error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });