import React, { useState, useEffect  } from 'react';
import {Card,Avatar, Button} from 'antd';
import { CheckOutlined } from '@ant-design/icons';

import s from './Vote.module.scss';
const { Meta } = Card;


export default function FormPage(){
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [isError, setError] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const r1 = await fetch('/api/candidates');
            const j1 = await r1.json();
            const r2 = await fetch ('/api/validvoter');
            const j2 = await r2.json();
            setData(j1);
            setIsValid(Boolean(j2)); 
        } catch (error) {
          setError(true)
        }
      setIsLoading(false);
    };
    fetchData();
  },[isValid, isError]);

  async function sendVote(id) {
    setIsLoading(true);
    try {
        const ret = await fetch('/api/vote ', {
            credentials: 'include',
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id,
            })
        })
    } catch (error) {
        setError(true);
        return;
    }
    //return the success page.
  }

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
        isValid ? (
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
                <div onClick={() => sendVote(i.id)} style={{'display':'flex','justifyContent': 'center','flexDirection':'row', 'alignItems':'center'}}>
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
        ) : (
          <p>No se te permite participar en las elecciones</p>
        )
      )}
    
        
    </div>
  );
}
