const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// legacy 2.9
// passport.use(
//   new LocalStrategy({
//       usernameField: 'Username',
//       passwordField: 'Password',
//     },
//     (Username, Password, done) => {
//       console.log(Username + "  " + Password);
//       Users.findOne({ Username: Username }).exec()
//         .then((user) => {
//         if (!user) {
//           console.log('incorrect username');
//           return done(null, false, { message: 'Incorrect username.'});
//         }

//         console.log('finished');
//         return done(null, user);
//       })
//         .catch((error) => {
//           console.log(error);
//           return done(error);
//         });
//     }
//   )
// );

passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    (username, password, callback) => {
      console.log(`Received username: ${username}`);
      console.log(`Received password: ${password}`);

      Users.findOne({Username: username})
        .then((user) => {
          if (!user) {
            console.log('Incorrect username');
            return callback(null, false, {message: 'Incorrect username'});
          }

          if (!user.validatePassword(password)) {
            return callback(null, false, {message: 'Incorrect password'});
          }

          console.log('finished');
          return callback(null, user);
        })
        .catch((error) => {
          console.log(error);
          return callback(error);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret',
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);