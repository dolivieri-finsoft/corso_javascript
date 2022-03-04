const express = require('express');
const app = express();
const port = 3000;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('Songs API - welcome aboard - available routings: create, delete, edit, list');
});

app.get('/create', (req, res) => {
  res.send('hai chiamato la create');
});

app.get('/delete', (req, res) => {
  res.send('hai chiamato la delete');
});

app.get('/edit', (req, res) => {
  res.send('hai chiamato la edit');
});

app.get('/list', (req, res) => {
  res.send('hai chiamato la list');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});