require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const loadCSV = require('./load-csv');
const features = require('./data/knnFeatures')
const labels = require('./data/knnLabels')
const shuffleSeed = require('shuffle-seed')

class Knn {
  constructor(n = 10, seed = "random") {
    const shuffledFeatures = shuffleSeed.shuffle(features, seed);
    const shuffledLabels = shuffleSeed.shuffle(labels, seed);
    this.testFeatures = shuffledFeatures.slice(0, n);
    this.testLabels = shuffledLabels.slice(0, n);
    this.trainFeatures = tf.tensor(shuffledFeatures.slice(n));
    this.trainLabels = tf.tensor(shuffledLabels.slice(n));
  }

  test(k) {
    let accuracies = [];
    let max = 0;
    let { length } = this.testFeatures;

    this.testFeatures.forEach((testPoint, i) => {
      const result = this.knn(this.trainFeatures, this.trainLabels, tf.tensor(testPoint), k);
      const accuracy = 100 - Math.abs((this.testLabels[i][0] - result) / this.testLabels[i][0] * 100);
      accuracies.push(accuracy);
      if (accuracy > max) { max = accuracy }
    });

    let { mean, variance } = tf.moments(tf.tensor(accuracies));
    let vals1 = mean.dataSync();
    let vals2 = variance.dataSync();
    let avg = Array.from(vals1)[0];
    let stddev = Math.pow(Array.from(vals2)[0], 0.5);

    return { mean: avg, stddev, max };
  }

  knn(features, labels, predictionPoint, k) {
    const { mean, variance } = tf.moments(features, 0);
    const scaledPrediction = predictionPoint.sub(mean).div(variance.pow(0.5));

    return features
      .sub(mean)
      .div(variance.pow(0.5))
      .sub(scaledPrediction)
      .pow(2)
      .sum(1)
      .pow(0.5)
      .expandDims(1)
      .concat(labels, 1)
      .unstack()
      .sort((a, b) => a.get(0) > b.get(0) ? 1 : -1)
      .slice(0, k)
      .reduce((acc, pair) => acc + pair.get(1), 0) / k;
  }
}

module.exports = Knn;
