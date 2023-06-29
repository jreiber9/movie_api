const express = require('express'),  
  morgan = require('morgan'),
  fs = require('fs'), // import built in node modules fs and path 
  path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// morgan, express, body-parser
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());

// user data
let users= [
  {
      id: 1,
      name: 'Bill',
      favoriteMovies: []
  },

  {
      id: 2,
      name: 'Lauren',
      favoriteMovies: ["Interstellar"]
  },

  {
      id: 3,
      name: 'Tobias',
      favoriteMovies: []
  },
    
]

// top movie data
let movies = [
  {
    Title: 'Star Wars',
    Genre: {
        Name: 'Adventure',
        Description: 'Implies a narrative that is defined by a journey (often including some form of pursuit) and is usually located within a fantasy or exoticized setting.'
    },
    Description: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empires world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.',
    Director: {
        Name: 'George Lucas',
        born: 'May 4th, 1944',
        bio: 'George Walton Lucas, Jr. is an American film director, producer, and screenwriter.'

    }
  },

  {
    Title: 'Indiana Jones and the Raiders of the Lost Ark',
    Genre: {
        Name: 'Adventure',
        Description: 'Implies a narrative that is defined by a journey (often including some form of pursuit) and is usually located within a fantasy or exoticized setting.'
    },
    Description: 'In 1936, archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before the Nazis can obtain its awesome powers.',
    Director: {
        Name: 'Steven Spielberg',
        born: 'December 18th, 1946',
        bio: 'Steven Spielberg is an American film director, producer, and screenwriter.'

    }
  },

  {
    Title: 'Interstellar',
    Genre: {
        Name: 'Sci-Fi',
        Description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, mutants, interstellar travel, time travel, or other technologies.'
    },
    Description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    Director: {
        Name: 'Christopher Nolan',
        born: 'July 30th, 1970',
        bio: 'Christopher Nolan is an American film director, producer, and screenwriter.'

    }
  },

  ];

// CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).json(newUser);
  } else {
      res.status(400).send('users neeed names')
  }
});

// UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id);

  if (user) {
      user.name = updatedUser.name;
      res.status(200).json(user);
  } else {
      res.status(400).send('users need names')
  }
});

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);;
  } else {
      res.status(400).send('no such user')
  }
});

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
      user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
      res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
  } else {
      res.status(400).send('no such user')
  }
});

// DELETE
app.delete('/users/:id', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
      user= users.filter( user => user.id != id);
      res.status(200).send(`user ${id} has been deleted`);
  } else {
      res.status(400).send('no such user')
  }
});

// READ
app.get('/movies', (req,res) => {
  res.status(200).json(movies);
});

// READ
app.get('/movies/:title', (req,res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title );

  if (movie) {
    res.status(200).json(movie);
  } else {
      res.status(400).send('no such movie')
  }

});

// READ
app.get('/movies/genre/:genreName', (req,res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
      res.status(400).send('no such genre')
  }

});

// READ
app.get('/movies/director/:directorName', (req,res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
      res.status(400).send('no such director')
  }

});



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