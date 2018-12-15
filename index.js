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

app.get('/api/', async (req, res) => {
  res.send({ success: "true" });
});

app.post('/api/knn/', async (req, res) => {
  let { testSetSize, k } = req.body;
  let knn = new Knn(testSetSize, Math.random());
  knn.test(k)
  let { mean, stddev, max } = knn.test(k);
  res.send({ mean, stddev, max, resultsTSS: testSetSize, resultsK: k });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT || 5000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
