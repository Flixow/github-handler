const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const PORT = '4040';

const projectController = require('./controllers/project');


app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('It works in the internet!');
});

app.get('/:id', projectController);
app.post('/:id', (req, res) => {
  res.send('It works in the internet!', req);
});

app.listen(PORT);

console.log(`Magic happens on http://localhost:${PORT}`);

exports.default = app;
