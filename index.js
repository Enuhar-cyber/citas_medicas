const express = require('express');
const mysql = require('mysql2');
const app = express();
var cors = require('cors');

app.use(cors());

const port= 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});