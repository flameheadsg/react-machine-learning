import React, { Component } from 'react';
import '../App.css';
import KnnScreen from './KnnScreen';

class App extends Component {
  render() {
    return (
      <div className="App">
        <KnnScreen style={{display: "inline-block"}}/>
      </div>
    );
  }
}

export default App;
