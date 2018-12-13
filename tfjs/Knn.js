require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const loadCSV = require('./load-csv');
const features = require('./data/knnFeatures')
const labels = require('./data/knnLabels')

class Knn {
  constructor(n = 10) {
    this.testFeatures = features.slice(0, n);
    this.testLabels = labels.slice(0, n);
    this.trainFeatures = tf.tensor(features.slice(n));
    this.trainLabels = tf.tensor(labels.slice(n));
  }

  test(k) {
    let sum = 0;
    let { length } = this.testFeatures;

    this.testFeatures.forEach((testPoint, i) => {
      const result = this.knn(this.trainFeatures, this.trainLabels, tf.tensor(testPoint), k);
      const err = (this.testLabels[i][0] - result) / this.testLabels[i][0] * 100;
      console.log("Error:", err, "%");
      err > 0 ? sum += err : sum -= err;
    });

    console.log(
      "\nAverage Error with test size of",
      length, "and k of", k + ":\n",
      (sum / length), "%\n"
    );
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
