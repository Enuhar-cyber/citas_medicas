const express = require('express');
const app = express();
var cors = require('cors');

app.use(cors());

const port= 3000;

app.use(express.json());
app.use(express.static('public'));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});