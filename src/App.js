import React from 'react';
import { ToastContainer } from "react-toastify";
import { Route, Switch } from "react-router-dom";
import './App.css';
import "react-toastify/dist/ReactToastify.css";
import Welcome from "./components/Welcome"
import FlagGameMain from "./components/FlagGameMain"


function App() {
  return (
    <main className="container">
      <React.Fragment>
        <ToastContainer autoClose={2000} />
        <Switch>
          <Route path="/play" component={FlagGameMain}></Route>
          <Route path="/" component={Welcome}></Route>
        </Switch>
      </React.Fragment>
    </main>
  );
}

export default App;
