import React from 'react';
import ScrollArea from 'react-scrollbar';
import NavBar from '../NavBar/NavBar';
import s from './Layout.module.scss';

export default function Layout({ children }) {

  return (
    <ScrollArea>
        <div className={s.layout}>
            <NavBar/>
            <main className={s.layout__main}>
                <div className = "grid">
                    {children}
                </div>
            </main>
        </div>
    </ScrollArea>
  )
}