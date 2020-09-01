const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
  console.log('This always runs');
  next();
});

app.use('/product', (req, res, next) => {
  res.send('<h1>I am product route</h1>');
  // next();
});

app.use('/', (req, res, next) => {
  res.send('<h1>I am default route</h1>');
  // next();
});

app.listen(3000, () => {
  console.log('Server started at 3000');
});
