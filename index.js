const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const bytes = require('bytes');
const Knn = require('./tfjs/Knn');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', async (req, res) => {
  res.send({ success: "true" });
});

app.post('/knn/', async (req, res) => {
  let { testSize, k } = req.body;
  let knn = new Knn(testSize);
  knn.test(k);
});

app.listen(process.env.PORT || 5000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
