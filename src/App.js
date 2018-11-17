import React, { Component } from "react";
import "./App.css";
import Customerlist from "./components/customerlist";
import cute from "./cute.png";
import Traininglist from "./components/traininglist";
import Calendar from "./components/calendar";

class App extends Component {
  constructor(params) {
    super(params);
    this.state = { page: "customers" };
  }

  render() {
    return (
      <div className="App">
        {this.state.page === "customers" && (
          <>
            <header className="App-header">
              <img src={cute} className="App-logo" alt="logo" />
              <h2>Customers</h2>
            </header>
            <Customerlist />
          </>
        )}

        {this.state.page === "trainings" && (
          <>
            <header className="App-header">
              <h2>Trainings</h2>
            </header>
            <Traininglist />
          </>
        )}

        {this.state.page === "calendar" && (
          <>
            <header className="App-header">
              <h2>Calendar</h2>
            </header>
            <Calendar />
          </>
        )}

        <footer>
          <button onClick={() => this.setState({ page: "trainings" })}>
            Trainings page
          </button>
          <button onClick={() => this.setState({ page: "customers" })}>
            Customers page
          </button>
          <button onClick={() => this.setState({ page: "calendar" })}>
            Customer Calendar
          </button>
        </footer>
      </div>
    );
  }
}

export default App;
