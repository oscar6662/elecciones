import React, { useState, useEffect  } from 'react';

import Navbar from '../components/Navbar';
import Load from '../components/Load';

import '../assets/styles/form-page.scss';

export default function FormPage(){
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await fetch('/api/candidates');
      const json = await result.json();
      setData(json);
      setIsLoading(false);
    };
    fetchData();
  },[true]);


  return(
    <>
      {isLoading ? (
        <Load></Load>
      ):(
        <p>done</p>
      )}
    </>
  );
}
