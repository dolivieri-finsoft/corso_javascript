const express = require('express');
const app = express();
const port = 3000;

// 1. TODO creare un file JSON (copia del vecchio stub per iniziare) che sia il DB delle nostre canzoni
// 2. TODO implementare la list servendo il file JSON stesso (cercare come servire file statici in express js) 
// 3. TODO implementare la create: legge il json, aggiunge un oggetto all'array, lo salva e risponde come nello stub precedente
// 4. TODO implementare la edit: legge il json, cerca/modifica un oggetto in array, lo salva e risponde come nello stub precedente
// 5. TODO implementare la delete: legge il json, cerca e cancella oggetto, lo salva e risponde come nello stub precedente

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