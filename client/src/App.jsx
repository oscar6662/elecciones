import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import Index from "./views/Index";

export default function App() {
  async function loggedIn(){
    const authenticated = fetch('/api/authenticated');
    if(authenticated.loggedIn === true) return true;
    return false;
  }
  
  return (
    <Router>
      <Switch>
        
      {loggedIn ? (
        <Route exact path="/" component={Index} />
      ) : (
        <Route exact path="/" render={() => (window.location = "http://localhost:5000/api/auth")} />
      )}
        
      </Switch>
    </Router>  
  );
}