const express = require('express');
const app = express();
const host = "0.0.0.0";
const port = 80;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, host, () => console.log(`Listening on port ${port}!`));