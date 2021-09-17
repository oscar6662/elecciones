import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import ReactLoading from 'react-loading';

import Index from "./views/Index";
import Vote from './views/Vote';
import Candidates from './views/Candidates';
import Layout from './components/Layout/Layout';

import './assets/styles/config.scss';
import './assets/styles/grid.scss';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await fetch('/api/authenticated');
      const json = await result.json();
      setLoggedIn(json.loggedIn);
      if(loggedIn) {
        const r = await fetch('/api/user/admin');
        const j = await r.json();
        setAdmin(Boolean(j));
      }
      setIsLoading(false);
    };
    fetchData();
  },[loggedIn]);
  return (
    isLoading ? (
      <ReactLoading type={'bubbles'} color={'black'}/>
    ) : (
    <Layout>
      <Router>
      <Switch>
        <Route exact path="/" children={<Index/>}/>
        <Route exact path="/candidates">
                {!loggedIn ? <Redirect to="/" /> : <Candidates />}
        </Route>
        <Route exact path="/vote">
                {!loggedIn ? <Redirect to="/" /> : <Vote />}
        </Route>
        <Route path="**" children={<Index/>}/>
      </Switch>
    </Router>
    </Layout>
  );
}