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

app.post('/api/knn/train/', async (req, res) => {
  let { testSetSize, k } = req.body;
  let knn = new Knn(testSetSize, Math.random());
  let { mean, stddev, max } = knn.train(k);
  res.send({ mean, stddev, max, resultsTSS: testSetSize, resultsK: k });
});

app.post('/api/knn/predict/', async (req, res) => {
  let { beds, baths, floors, sqft, k } = req.body;
  let knn = new Knn(0);
  let {
    price,
    closest,
    resBeds,
    resBaths,
    resFloors,
    resSqft
  } = knn.predict(beds, baths, floors, sqft, k);
  res.send({
    price,
    closest,
    resBeds,
    resBaths,
    resFloors,
    resSqft,
    resK: k
  });
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
