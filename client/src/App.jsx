import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import ReactLoading from 'react-loading';

import Index from "./views/Index/Index";
import Vote from './views/Vote/Vote';
import Layout from './components/Layout/Layout';

import './assets/styles/grid.scss';
import './assets/styles/config.scss';
import s from './app.module.scss';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validVoter, setValidVoter] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('/api/authenticated');
      const json = await result.json();
      setLoggedIn(json);
      const r = await fetch('/api/user/isadmin');
      const j = await r.json();
      setAdmin(Boolean(j));
      const r2 = await fetch('/api/validvoter');
      const j2 = await r2.json();
      setValidVoter(Boolean(j2));
      console.log(loggedIn);
      console.log(validVoter);
      setIsLoading(false);
    };
    fetchData();
  },[loggedIn]);
  return (
    isLoading ? (
      <div className={s.loading}>
        <ReactLoading type={'bubbles'} color={'black'}/>
      </div>
    ) : (
      <Layout>
        <Switch>
          <Route exact path="/" children={<Index/>}/>
          <Route exact path="/vote">
                  {!loggedIn || !validVoter ? <Redirect to="/" /> : <Vote />}
          </Route>
          <Route path="**" children={<Index/>}/>
        </Switch>
      </Layout>
    )
  )
}