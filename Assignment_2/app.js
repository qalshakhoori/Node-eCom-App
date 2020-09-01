const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('I am the first middleware');
  next();
});

app.use((req, res, next) => {
  console.log('I am the second middleware');
  next();
});

app.use('/users', (req, res, next) => {
  res.send('<h1>I am the users route</h1>');
});

app.use('/', (req, res, next) => {
  res.send('<h1>I am the default route</h1>');
});

app.listen(3000, () => {
  console.log('started at 3000');
});
