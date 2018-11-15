import React, { Component } from "react";
import "./App.css";
import Customerlist from "./components/customerlist";
import cute from "./cute.png";
import Traininglist from "./components/traininglist";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={cute} className="App-logo" alt="logo" />
          <h2>Customer Info</h2>
        </header>
        <Customerlist />
        <Traininglist />
      </div>
    );
  }
}

export default App;
