import React from 'react';
import { useLocation } from "react-router-dom";
import ScrollArea from 'react-scrollbar';

import s from './Layout.module.scss';

export default function Layout({ children }) {
  const path  = useLocation();
  const pages = {
    '/vote': 'Votar',
    '/candidates': 'Candidatos',
  }

  return (
    <ScrollArea>
        <div className={s.layout}>
            <header>
                {pages[path.pathname]}
            </header>
            <main className={s.layout__main}>
                <div className = "grid">
                    {children}
                </div>
            </main>
        </div>
    </ScrollArea>
  )
}