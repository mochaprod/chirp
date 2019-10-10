const express = require('express');
const app = express();
const host = '0.0.0.0';
const port = 80;

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/adduser', (req, res) => {});

app.post('/login', (req, res) => {});

app.post('/logout', (req, res) => {});

app.post('/verify', (req, res) => {});

app.post('/additem', (req, res) => {});

app.get('/item/:itemid', (req, res) => { res.send('Your item id is: ' + req.params.itemid); });

app.post('/search', (req, res) => {});

app.listen(port, host, () => console.log(`Listening on port ${port}!`));