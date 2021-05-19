import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import Index from "./views/Index";
import Vote from './views/Vote';
import FormPage from './views/FormPage';
import Candidates from './views/Candidates';

import './assets/styles/config.scss';
import './assets/styles/grid.scss';

export default function App() {
  return (
    <Router>
      <Switch>
      <Route exact path="/" component={Index}/>
      <Route exact path="/form" component={FormPage}/>
      <Route exact path="/candidates" component={Candidates}/>
      <Route exact path="/vote" component={Vote}/>
      <Route path="**" component={Index}/>
      </Switch>
      
    </Router>
    
  );
}