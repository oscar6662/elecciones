import React, { useState, useEffect  } from 'react';

import Navbar from '../components/Navbar';
import Load from '../components/Load';

import '../assets/styles/candidates.scss';

export default function FormPage(){
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await fetch('/api/candidates');
      const json = await result.json();
      console.log(json);
      setData(json);
      setIsLoading(false);
    };
    fetchData();
  },[true]);


  return(
    <>
      <Navbar></Navbar>
      <div className=" grid box-pool">
        {isLoading ? (
          <div className="box col-3 col-md-12 col-sm-12">
            <Load></Load>
          </div>
        ):(
          data.map(item => (
            <div className="box col-3 col-md-12 col-sm-12">
              <h1>{item.name}</h1>
              <hr></hr>
              <p>{item.text}</p>
            </div>
         ))
      )}
      </div>
    </>
  );
}
