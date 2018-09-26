import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import 'antd/dist/antd.css';
import './App.css';

import Home from './components/home';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
      </Switch>
    );
  }
}

export default App;
