

import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { useLocation } from "react-router-dom";
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';

import s from './NavBar.module.scss';

export default function NavBar() {
  const path  = useLocation();
  const pages = {
    '/vote': 'Votar',
    '/candidates': 'Candidatos',
    '/':'',
  }
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('/api/authenticated');
      const json = await result.json();
      setLoggedIn(json);
      setIsLoading(false);
    };
    fetchData();
  },[loggedIn]);

  return (
    <header className={s.navbar}>
      <div></div>
      <div></div>
      <div>
        {isLoading ? (
          <ReactLoading type={'bubbles'} color={'black'}/>
        ) : (
          !loggedIn ?(
            <div className={s.navbar__login}>
              <LoginOutlined/>
              <a href = "api/auth">Iniciar Sesión</a>
            </div>
          ) : (
            <div className={s.navbar__logout}>
              <a href = "api/logout">Cerrar Sesión
              <LogoutOutlined/>
              </a>
            </div>
          )
        )}
      </div>
    </header>
  )
}