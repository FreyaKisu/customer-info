import React, { Component } from "react";
import "./App.scss";
import Customerlist from "./components/customerlist";
import cute from "./cute.png";
import dumbbell from "./dumbbell.png";
import Traininglist from "./components/traininglist";
import Calendar from "./components/calendar";
import firebase from "firebase/app";
import { format } from "url";
require("firebase/auth");

// Initialize Firebase
const config = {
  apiKey: "AIzaSyB6koKM76KmfhUtf9wL6x3bpIZO2WDVIVA",
  authDomain: "fir-auth-for-react.firebaseapp.com",
  databaseURL: "https://fir-auth-for-react.firebaseio.com",
  projectId: "fir-auth-for-react",
  storageBucket: "fir-auth-for-react.appspot.com",
  messagingSenderId: "318108803943"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(params) {
    super(params);
    this.state = {
      page: "calendar",
      user: "",
      loginEmail: "",
      loginPassword: "",
      adminMode: false
    };
  }

  componentDidMount() {}
  setEmail = e => {
    this.setState({
      loginEmail: e.target.value
    });
  };

  setPassword = e => {
    this.setState({
      loginPassword: e.target.value
    });
  };

  //login admin: freya@a.com pwd: freya123; login user: matti@hotmale.com pwd: hotmale
  login = () => {
    if (this.state.loginPassword !== "" || this.state.loginEmail !== "") {
      firebase
        .auth()
        .signInWithEmailAndPassword(
          this.state.loginEmail,
          this.state.loginPassword
        )
        .then(r => {
          console.log(r);

          if (r.user.email === "freya@a.com") {
            this.setState({
              adminMode: true,
              user: r.user.email,
              loginEmail: "",
              loginPassword: "",
              page: "customers"
            });
          } else {
            this.setState({
              user: r.user.email,
              loginEmail: "",
              loginPassword: "",
              page: "calendar",
              adminMode: false
            });
          }
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorCode + ": " + errorMessage);
        });
    }
  };

  logout = () => {
    this.setState({
      user: ""
    });
  };
  render() {
    return (
      <div className="App">
        {this.state.user === "" && (
          <div id="login">
            <input
              type="email"
              placeholder="user e-mail"
              onChange={this.setEmail}
            />
            <input
              type="password"
              placeholder="password"
              onChange={this.setPassword}
            />
            <button className="btn btn-outline-success" onClick={this.login}>
              Login
            </button>
          </div>
        )}
        {this.state.user !== "" && (
          <div id="logged">
            {this.state.page === "customers" && (
              <>
                <header className="App-header ">
                  <img src={cute} className="App-logo" alt="logo" />
                  <h2 className="text-success">Customers</h2>
                  <button
                    className="btn btn-outline-success"
                    onClick={this.logout}
                  >
                    Logout
                  </button>
                </header>
                <Customerlist />
              </>
            )}

            {this.state.page === "trainings" && (
              <>
                <header className="App-header">
                  <img src={dumbbell} className="App-logo" alt="logo" />
                  <h2 className="text-info">Trainings</h2>
                  <button
                    className="btn btn-outline-info"
                    onClick={this.logout}
                  >
                    Logout
                  </button>
                </header>
                <Traininglist />
              </>
            )}

            {this.state.page === "calendar" && (
              <>
                <header className="App-header">
                  <h2 className="text-warning">Calendar</h2>
                  <button
                    className="btn btn-outline-warning"
                    onClick={this.logout}
                  >
                    Logout
                  </button>
                </header>
                <Calendar user={this.state.user} />
              </>
            )}
            {this.state.adminMode === true && (
              <footer>
                <button
                  className="btn btn-outline-info"
                  onClick={() => this.setState({ page: "trainings" })}
                >
                  Trainings page
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => this.setState({ page: "customers" })}
                >
                  Customers page
                </button>
                <button
                  className="btn btn-outline-warning"
                  onClick={() => this.setState({ page: "calendar" })}
                >
                  Customer calendar
                </button>
              </footer>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
