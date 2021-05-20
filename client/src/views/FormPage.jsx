import React, { useState, useEffect  } from 'react';
import Navbar from '../components/Navbar';
import Form from '../components/Form';

import Load from '../components/Load';
import '../assets/styles/form-page.scss';

export default function FormPage(){
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await fetch('/api/authenticated');
      const json = await result.json();
      const r = await fetch('/api/candidate/requisites');
      const j = await r.json();
      if(j.response === true){
        setIsValid(true);
      } else {
        setErrors(j.response);
      }
      if(json.loggedIn === true) setisLoggedIn(true);

      setIsLoading(false);
    };
    fetchData();
  },[true]);


  return(
    
    
    <>
      <Navbar/>
      <div className='form'>
      {isLoading ? (
        <Load />
      ):(
        !isLoggedIn ? (
          <a href="/api/auth">You must Log In</a>
        ):(
          isValid ? (
            <Form></Form>
          ):(
            <div className="errors">
              <p>No te puedes presentar como director ya que:</p>
              {errors.division === 'error' && <p>No estás asignado a la división espanola</p>}
              {errors.rating === 'error' && <p>Tu Rango no es el suficiente</p>}
            </div>
          )
          
        )
      )}

      
    </div>
    </>
  );
}
