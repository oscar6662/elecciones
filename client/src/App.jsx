import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import Index from "./views/Index";

export default function App() {
  
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Index} />
      </Switch>
    </Router>  
  );
}