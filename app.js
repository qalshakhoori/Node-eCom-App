const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorsController = require('./controllers/errors');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// This block is only needed because we don't have
// an authentication mechanisme yet
app.use((req, res, next) => {
  User.findById('5f868fff4bf5ab00074e9579')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});
///////////////////////////////////////////////////

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// app.use(errorsController.get404);

mongoConnect((client) => {
  app.listen(3001);
});
