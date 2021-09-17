import React, { useState, useEffect  } from 'react';
import {Card,Avatar} from 'antd';
import { CheckOutlined } from '@ant-design/icons';

import s from './Vote.module.scss';
const { Meta } = Card;


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
    <div className={s.index}>
        <Card
          style={{ width: 300 }}
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <div style={{'display':'flex','justifyContent': 'center','flexDirection':'row', 'alignItems':'center'}}>
              <CheckOutlined key="vote" /><p style={{'margin-bottom':'0', 'marginLeft': '5px'}}>Votar</p>
            </div>,
            
          ]}
        >
          <Meta
            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
            title="Card title"
            description="This is the description"
          />
        </Card>,
    </div>
  );
}
