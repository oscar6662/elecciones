import React from 'react';
import { Steps } from 'antd';

import 'antd/dist/antd.css';
import s from './Index.module.scss';
const { Step } = Steps;

export default function Index(){
  const date = new Date(Date.now());
  let finalDate = new Date();
  finalDate.setUTCMonth(4);
  finalDate.setUTCDate(24);
  finalDate.setUTCHours(23);
  finalDate.setUTCMinutes(59);
  let startDate = new Date();
  startDate.setUTCDate(24);
  startDate.setUTCHours(23);
  startDate.setUTCMinutes(59);
  const percent = 100-((finalDate-date)/(finalDate-startDate))*100;
  
  return(
    <div className={s.index}>
      <Steps current={0} percent = {percent} style={{'paddingTop':'1rem'}}>
        <Step title={'Revisión de la constitución'} 
          description="Hasta el 7 de Abril"
        />
        <Step title="Votación" description="24/04" />
        <Step title="Resultados" />
      </Steps>

    </div>
  );
}