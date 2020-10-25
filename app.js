const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb://nodejs:Password1234@127.0.0.1:27017/shop';

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorsController = require('./controllers/errors');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'A very long complex secret string',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// This block is only needed because we don't have
// an authentication mechanisme yet
app.use((req, res, next) => {
  User.findById('5f8d351eb36e4a0884bcf5db')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
///////////////////////////////////////////////////

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    console.log('listening on port 3001');
    app.listen(3001);
  })
  .catch(() => {
    console.log();
  });
