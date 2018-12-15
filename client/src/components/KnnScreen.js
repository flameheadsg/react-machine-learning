import React, { Component } from 'react';
import '../knn.css';
import axios from 'axios';
import ReactLoading from 'react-loading';
import Result from './Result';

export default class KnnScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resultsTSS: 0,
      resultsK: 0,
      testSetSize: 0,
      k: 0,
      mean: 0,
      stddev: 0,
      max: 0,
      loading: false
    };

    this.myRef = React.createRef();
    this.knn = this.knn.bind(this);
    this.handleTestSetSize = this.handleTestSetSize.bind(this);
    this.handleK = this.handleK.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
    this.showResults = this.showResults.bind(this);
  }

  async knn() {
    if (!this.state.loading) {
      this.setState({ loading: true });
      let res = await axios.post('/api/knn/', {
        testSetSize: parseInt(this.state.testSetSize),
        k: parseInt(this.state.k)
      });
      let { mean, stddev, max, resultsTSS, resultsK } = res.data;
      this.setState({ mean, stddev, max, resultsTSS, resultsK, loading: false },
      () => this.showResults());
    }
  }

  renderErrors() {
    if (this.state.mean > 0) {
      return (
        <div ref={this.myRef} style={{textAlign: "center"}}>
          <Result callback={this.showResults} text={
            <div>
              <strong>Average accuracy of KNN algorithm with test set size of {this.state.resultsTSS}&nbsp;
              and k-value of {this.state.resultsK}:</strong><br /><br />{this.state.mean.toFixed(5)}%
            </div>
          }/>
          <Result text={
            <div>
              <strong>Standard deviation of accuracy among predictions:</strong><br /><br />
              {this.state.stddev.toFixed(5)}%
            </div>
          }/><br />
          <Result text={
            <div>
              <strong>Most accurate prediction:</strong><br /><br />{this.state.max.toFixed(5)}%
            </div>
          }/>
          <br /><br /><br /><br /><hr />
        </div>
      );
    }
  }

  showResults() {
    window.scrollTo({
      top: this.myRef.current.offsetTop,
      behavior: "smooth"
    });
  }

  handleTestSetSize(e) {
    this.setState({ testSetSize: e.target.value });
  }

  handleK(e) {
    this.setState({ k: e.target.value });
  }

  render() {
    return (
      <div style={styles.main}>
        <h1>K-Nearest-Neighbor</h1>
        <hr /><br /><br />
        <img src={require('../img/knn.png')} style={{height: 350, width: 450}} alt="knn"/><br /><br />
        <p style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          The K-Nearest-Neighbor (KNN) algorithm makes predictions about some point by
          averaging the values of the "k" closest points in a data set. The image
          above provides a graphical depiction. The logic is based around the notion
          that "birds of a feather flock together," so it makes sense to look at surrounding
          data points when making a prediction.
        </p>
        <p style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          Below, you will be able to experiment with the KNN algorithm yourself using data collected
          {" from 500 randomly sampled houses. We are going to make the assumption that a house's "}
          # of bedrooms, # of bathrooms, # of floors and # of square feet all significantly impact
          its price on the market. Using these independent variables, we will make predictions for random houses
          using KNN and compare our predictions to their actual prices. This will help us gauge how accurate
          our algorithm really is.
        </p>
        <p style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          The test set size will determine <strong>how many predictions we make</strong> to test our algorithm with.
          A test set size of 1 will return the statistics for
          {" just a single house's prediction, so a larger test set is necessary for our algorithm's "}
          descriptive statistics to be meaningful. Keep in mind that
          larger test sets will take more time for the server to process. The test set is
          not taken into consideration when analyzing the data, so a size of 10 would tell our
          algorithm to randomly separate 10 houses from the data set and make predictions for each one
          of the 10 house using the remaining 490 data points, referred to as the training set.
        </p><br /><br />
        <div style={{display: "flex", justifyContent: "center"}}>
          <p style={{fontSize: "20px"}}>Size of Test Set:&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <input
            value={this.state.testSetSize}
            onChange={this.handleTestSetSize}
            style={{fontSize: "16px", paddingLeft: 10}}
          />
        </div><br />
        <p style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          The value of K determines <strong>how many similar houses are taken into consideration</strong>
          {" while predicting a house's price. A k-value of 1 would simply give you the price of the most "}
          similar house in the training set, while setting K equal to the size of the training set would give you the
          average price of all houses. Think of K as how liberal you want to be when making a prediction, and experiment
          with different k-values for different test set sizes to see how your results change.
        </p><br /><br />
        <div style={{display: "flex", justifyContent: "center"}}>
          <p style={{fontSize: "20px"}}>Value of K:&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <input
            value={this.state.k}
            onChange={this.handleK}
            style={{fontSize: "16px", paddingLeft: 10}}
          />
        </div>
        <br /><br />
        <div onClick={this.knn} className="knn-btn">
          {(this.state.loading ?
            <div>
              <p>Running Algorithm</p>
              <div style={{display: "inline-block"}}>
                <ReactLoading type={"bars"} color={"#fff"} height={30} width={30} />
              </div>
            </div> :
            "Test KNN"
          )}
        </div><br /><br /><hr /><br />
        {this.renderErrors()}
      </div>
    );
  }
}

const styles = {
  main: {
    width: 1000,
    display: "inline-block",
    marginTop: 50,
    marginBottom: 50,
    padding: 40,
    color: "rgb(0, 61, 112)",
    backgroundColor: "rgb(193, 227, 255)",
    borderRadius: 7
  },
  text: {
    fontSize: "22px",
    maxWidth: 850,
    display: "inline-block",
    textAlign: "justify"
  }
};
