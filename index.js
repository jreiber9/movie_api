const express = require('express');  
  morgan = require('morgan'),
  fs = require('fs'), // import built in node modules fs and path 
  path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

// top movie data
let topMovies = [
    {
      title: 'Interstellar',
      director: 'Christopher Nolan'
    },
    {
      title: 'Lord of the Rings: Fellowship of the Ring',
      director: 'Peter Jackson'
    },
    {
      title: 'Star Wars: Episode IV - A New Hope',
      director: 'George Lucas'
    },
    {
        title: 'Lucky Number Slevin',
        director: 'Paul McGuigan'
      },
    {
        title: 'Deadpool 2',
        director: 'David Leitch'
    },
    {
        title: 'Star Wars: Episode III - Revenge of the Sith',
        director: 'George Lucas'
    },
    {
        title: 'Se7en',
        director: 'David Fincher'
    },
    {
        title: 'Pandorum',
        director: 'Christian Alvart'
    },
    {
        title: 'Forgetting Sarah Marshall',
        director: 'Nicholas Stoller'
    },
    {
        title: 'Guardians of the Galaxy',
        director: 'James Gunn'
    }
  ];

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
    res.json(topMovies);
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