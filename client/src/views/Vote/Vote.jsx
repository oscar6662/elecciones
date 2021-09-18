import React, { useState, useEffect  } from 'react';
import {Card,Avatar, Button} from 'antd';
import { CheckOutlined } from '@ant-design/icons';

import s from './Vote.module.scss';
const { Meta } = Card;


export default function FormPage(){
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('/api/candidates');

      const json = await result.json();
      setData(json);
      setIsLoading(false);
    };
    fetchData();
  },[error]);


  return(
    <div className={s.vote}>
      {isLoading ? (
        <Card style={{ width: 300, marginTop: 16 }} loading={isLoading}>
          <Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title="Card title"
            description="This is the description"
          />
        </Card>
      ) : (
        data.map(i => (
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
              title={i.user_name}
              description="This is the description"
            />
          </Card>
        ))
        
      )}
    
        
    </div>
  );
}
