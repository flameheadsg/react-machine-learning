import React, { Component } from 'react';
import axios from 'axios';

export default class KnnScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testSize: 0,
      k: 0
    };

    this.knn = this.knn.bind(this);
    this.handleTestSize = this.handleTestSize.bind(this);
    this.handleK = this.handleK.bind(this);
  }

  async knn() {
    await axios.post('http://localhost:5000/knn/', {
      testSize: parseInt(this.state.testSize),
      k: parseInt(this.state.k)
    });
  }

  handleTestSize(e) {
    this.setState({ testSize: e.target.value });
  }

  handleK(e) {
    this.setState({ k: e.target.value });
  }

  render() {
    return (
      <div style={styles.main}>
        <h2>K-Nearest-Neighbor (KNN)</h2>
        <hr />
        <p style={{fontSize: "22px"}}>
          {
            "The K-Nearest-Neighbor algorithm makes predictions by averaging " +
            'the values of the "k" closest points in a data set. Below you can ' +
            'experiment with different test set sizes (out of 50 records total) ' +
            'and different values of "k."'
          }
        </p>
        <div style={{display: "flex", justifyContent: "center"}}>
          <p>Size of Test Set:&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <input
            value={this.state.testSize}
            onChange={this.handleTestSize}
            style={{fontSize: "16px", paddingLeft: 10}}
          />
        </div>
        <br />
        <div style={{display: "flex", justifyContent: "center"}}>
          <p>Value of K:&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <input
            value={this.state.k}
            onChange={this.handleK}
            style={{fontSize: "16px", paddingLeft: 10}}
          />
        </div>
        <br /><br />
        <button onClick={this.knn} style={{transform: "scale(1.6)"}}>
          Test KNN
        </button>
      </div>
    );
  }
}

const styles = {
  main: {
    width: 800,
    display: "inline-block",
    marginTop: 100,
    padding: 40,
    color: "rgb(0, 61, 112)",
    backgroundColor: "rgb(193, 227, 255)",
    borderRadius: 7
  }
};
