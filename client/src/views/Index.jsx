import React, { useState, useEffect  } from 'react';
import Navbar from '../components/Navbar';
import '../assets/styles/main.scss'

export default function Index(){
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await fetch('/api/user');
      const json = await result.json();
      console.log(json);
      setData(json);
      setIsLoading(false);
    };
    fetchData();
  },[true]);
  
  return(
    <>
      <div className="box col-3 col-md-12 col-sm-12">
        <a href="/form">
          <h1>Presentar Candidato</h1>
        </a>
        <p>
          Crees tener lo que se require para dirigir el vACC espanol?
        </p>
      </div>
      <div className="box col-3 col-md-12 col-sm-12">
        <a href="/candidates">
          <h1>Candidatos</h1>
        </a>
        <p>Candidatos presentados hasta el momento</p>
      </div>
      <div className="box col-3 col-md-12 col-sm-12">
        <h2>6 de Septiembre</h2>
        <a href="/Votar">
          <h1>Votar</h1>
        </a>
        <p>Guardate la fecha y no olvides votar!</p>
      </div>
    </>
  );
}