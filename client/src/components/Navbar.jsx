import React, { useState, useEffect  } from 'react';
import { useRouteMatch, Link } from "react-router-dom";

import Load from './NavLoad';

import '../assets/styles/nav.scss'
import logo from '../assets/img/VATSPA_LOGO.png';

export default function Index(){
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await fetch('/api/authenticated');
      const json = await result.json();
      if (json.loggedIn === true) {
        const r = await fetch('/api/user/name');
        const j = await r.json();
        setName(String(j));
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };
    fetchData();
  },[true]);

  let { path } = useRouteMatch();
  const pages = {
    '/form': 'Formulario de aplicación para la posición de Director',
    '/candidates': 'Candidatos para Director de vACC',
    '/vote': 'Votar',
    '/': 'Elecciones VATSPA 2021',
  }
  return(
    <div className="nav">
      <div className="content grid">
        <Link to ="/">
        <img src={logo} alt="Logo"/>
        </Link>
        <h1>{pages[path]}</h1>
        {isLoading ? (
          <Load />
        ):(
          isLoggedIn ? (
            <a href ="/api/logout">{name}</a>
          ):(
            <a href="/api/auth">Iniciar Sesión</a>
          )
        )}
      </div>
    </div>
  );
}