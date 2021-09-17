import React, { useState, useEffect  } from 'react';
import { Steps } from 'antd';

import 'antd/dist/antd.css';
import s from './Index.module.scss';
const { Step } = Steps;

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
    <div className={s.index}>
      <Steps progressDot current={1} style={{'padding-top':'1rem'}}>
        <Step title="Primer Paso" description="This is a description." />
        <Step title="Segundo Paso" description="This is a description." />
        <Step title="Tercer Paso" description="This is a description." />
      </Steps>

    </div>
  );
}