import React from 'react';
import { Steps } from 'antd';

import 'antd/dist/antd.css';
import s from './Index.module.scss';
const { Step } = Steps;

export default function Index(){
  const date = new Date(Date.now());
  let finalDate = new Date();
  finalDate.setUTCDate(30);
  finalDate.setUTCHours(23);
  finalDate.setUTCMinutes(59);
  let startDate = new Date();
  startDate.setUTCDate(16);
  startDate.setUTCHours(9);
  startDate.setUTCMinutes(36);
  const percent = 100-((finalDate-date)/(finalDate-startDate))*100;
  
  return(
    <div className={s.index}>
      <Steps current={0} percent = {percent} style={{'paddingTop':'1rem'}}>
        <Step title={
          <a href = "https://forums.vatsim.net/topic/31977-vacancy-vacc-director-spain">
          Presentarse como candidato
          </a>} 
          description="Hasta el 30 de Septiembre"
        />
        <Step title="Votar Candidato" description="Fecha sin determinar" />
        <Step title="Resultados" />
      </Steps>

    </div>
  );
}