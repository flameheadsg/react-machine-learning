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
      loading: false,
      sqft: 0,
      beds: 0,
      baths: 0,
      floors: 0,
      testK: 0,
      price: 0,
      resBeds: 0,
      resBaths: 0,
      resFloors: 0,
      resSqft: 0,
      resK: 0
    };

    this.myRef = React.createRef();
    this.otherRef = React.createRef();
    this.knn = this.knn.bind(this);
    this.handleTestSetSize = this.handleTestSetSize.bind(this);
    this.handleK = this.handleK.bind(this);
    this.renderAccuracies = this.renderAccuracies.bind(this);
    this.showResults = this.showResults.bind(this);
    this.handleSqft = this.handleSqft.bind(this);
    this.handleBeds = this.handleBeds.bind(this);
    this.handleBaths = this.handleBaths.bind(this);
    this.handleFloors = this.handleFloors.bind(this);
    this.handleTestK = this.handleTestK.bind(this);
    this.predict = this.predict.bind(this);
    this.showPrediction = this.showPrediction.bind(this);
    this.renderPrediction = this.renderPrediction.bind(this);
    this.toDollars = this.toDollars.bind(this);
  }

  toDollars(amount) {
    return "$" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async predict() {
    if (
      !this.state.loading &&
      this.state.beds > 0 &&
      this.state.baths > 0 &&
      this.state.floors > 0 &&
      this.state.sqft > 0 &&
      this.state.testK > 0
    ) {
      this.setState({ loading: true });
      let res = await axios.post('/api/knn/predict/', {
        beds: parseInt(this.state.beds),
        baths: parseInt(this.state.baths),
        floors: parseInt(this.state.floors),
        sqft: parseInt(this.state.sqft),
        k: parseInt(this.state.testK)
      });
      console.log(res.data);
      let {
        price,
        resBeds,
        resBaths,
        resFloors,
        resSqft,
        resK
      } = res.data;
      this.setState({
        price,
        resBeds,
        resBaths,
        resFloors,
        resSqft,
        resK,
        loading: false
      },
      () => this.showPrediction());
    } else {
      window.alert("Please insert values greater than 0 to predict price with.")
    }
  }

  async knn() {
    if (this.state.testSetSize <= 0) {
      window.alert("Please select a test set size greater than 0.");
    } else if (this.state.testSetSize >= 500) {
      window.alert("Please select a test set size less than 500.");
      return;
    }

    if (this.state.k <= 0) {
      window.alert("Please select a k-value greater than 0.");
    } else if (this.state.k >= 500) {
      window.alert("Please select a k-value less than 500.");
      return;
    }

    if (!this.state.loading && this.state.k > 0 && this.state.testSetSize > 0) {
      this.setState({ loading: true });
      let res = await axios.post('/api/knn/train/', {
        testSetSize: parseInt(this.state.testSetSize),
        k: parseInt(this.state.k)
      });
      let { mean, stddev, max, resultsTSS, resultsK } = res.data;
      this.setState({ mean, stddev, max, resultsTSS, resultsK, loading: false },
      () => this.showResults());
    }
  }

  renderPrediction() {
    if (this.state.resK > 0) {
      return (
        <div ref={this.otherRef} style={{textAlign: "center"}}>
          <Result text={
            <div>
              <strong>Predicted price of house with {this.state.resBeds} {(this.state.resBeds > 1 ? "beds" : "bed")},&nbsp;
              {this.state.resBaths} {(this.state.resBaths > 1 ? "baths" : "bath")},&nbsp;
              {this.state.resFloors} {(this.state.resFloors > 1 ? "floors" : "floor")}&nbsp;
              and {this.state.resSqft} sqft. using a k-value of {this.state.resK}:</strong><br /><br />
              {this.toDollars(this.state.price.toFixed(2))}
            </div>
          }/>
          <br /><br /><br /><br /><hr />
        </div>
      );
    }
  }

  renderAccuracies() {
    if (this.state.resultsK > 0) {
      return (
        <div ref={this.myRef} style={{textAlign: "center"}}>
          <Result text={
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

  showPrediction() {
    window.scrollTo({
      top: this.otherRef.current.offsetTop,
      behavior: "smooth"
    });
  }

  handleTestSetSize(e) {
    this.setState({ testSetSize: e.target.value });
  }

  handleK(e) {
    this.setState({ k: e.target.value });
  }

  handleSqft(e) {
    this.setState({ sqft: e.target.value });
  }

  handleBeds(e) {
    this.setState({ beds: e.target.value });
  }

  handleBaths(e) {
    this.setState({ baths: e.target.value });
  }

  handleFloors(e) {
    this.setState({ floors: e.target.value });
  }

  handleTestK(e) {
    this.setState({ testK: e.target.value });
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
          that "birds of a feather flock together," so it makes sense to look at nearby
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
          of the 10 houses using the remaining 490 data points, referred to as the training set.
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
        {this.renderAccuracies()}
        <p style={styles.text}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          You can use the results for different k-values and test set sizes to find an optimal
          value for K. One should look for higher mean accuracies and lower standard deviations, which measures
          how widely distributed a data set is. Higher means and lower standard deviations tell us that at those
          values of K the predictions made using the test set were both accurate and consistent. Below you can plug in
          any combination of bedrooms, bathrooms, floors, and square feet and use your optimized K to predict
          the price of a house with your chosen characteristics using KNN.
        </p><br /><br />
        <div style={{display: "flex", justifyContent: "flex-end", position: "relative", right: 350}}>
          <p style={{fontSize: "20px"}}># of Bedrooms:&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <input
            value={this.state.beds}
            onChange={this.handleBeds}
            style={{fontSize: "16px", paddingLeft: 10}}
          />
        </div><br /><br />
        <div style={{display: "flex", justifyContent: "flex-end", position: "relative", right: 350}}>
          <p style={{fontSize: "20px"}}># of Bathrooms:&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <input
            value={this.state.baths}
            onChange={this.handleBaths}
            style={{fontSize: "16px", paddingLeft: 10}}
          />
        </div><br /><br />
        <div style={{display: "flex", justifyContent: "flex-end", position: "relative", right: 350}}>
          <p style={{fontSize: "20px"}}># of Floors:&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <input
            value={this.state.floors}
            onChange={this.handleFloors}
            style={{fontSize: "16px", paddingLeft: 10}}
          />
        </div><br /><br />
        <div style={{display: "flex", justifyContent: "flex-end", position: "relative", right: 350}}>
          <p style={{fontSize: "20px"}}># of Square Feet:&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <input
            value={this.state.sqft}
            onChange={this.handleSqft}
            style={{fontSize: "16px", paddingLeft: 10}}
          />
        </div><br /><br />
        <div style={{display: "flex", justifyContent: "flex-end", position: "relative", right: 350}}>
          <p style={{fontSize: "20px"}}>K:&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <input
            value={this.state.testK}
            onChange={this.handleTestK}
            style={{fontSize: "16px", paddingLeft: 10}}
          />
        </div><br /><br />
        <div onClick={this.predict} className="knn-btn">
          {(this.state.loading ?
            <div>
              <p>Running Algorithm</p>
              <div style={{display: "inline-block"}}>
                <ReactLoading type={"bars"} color={"#fff"} height={30} width={30} />
              </div>
            </div> :
            "Predict Price"
          )}
        </div><br /><br /><hr /><br />
        {this.renderPrediction()}
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
