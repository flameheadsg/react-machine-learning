import React, { Component } from 'react';

export default class Result extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.main}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {this.props.text}
      </div>
    );
  }
}

const styles = {
  main: {
    display: "inline-block",
    padding: 20,
    marginTop: 40,
    borderRadius: 10,
    maxWidth: 560,
    color: "white",
    backgroundColor: "rgb(55, 74, 204)",
    fontSize: 20
  }
};
