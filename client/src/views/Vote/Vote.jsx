import React, { useState, useEffect  } from 'react';
import {Card,Avatar, Result} from 'antd';
import { CheckOutlined } from '@ant-design/icons';

import s from './Vote.module.scss';
const { Meta } = Card;


export default function FormPage(){
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [isError, setError] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const r1 = await fetch('/api/candidates');
            const j1 = await r1.json();
            const r2 = await fetch ('/api/validvoter');
            const j2 = await r2.json();
            const r3 = await fetch ('/api/hasvoted');
            const j3 = await r3.json();
            setData(j1);
            setIsValid(Boolean(j2)); 
            setHasVoted(Boolean(j3));
        } catch (error) {
          setError(true)
        }
      setIsLoading(false);
    };
    fetchData();
  },[isValid, isError]);

  async function sendVote(id) {
    
    try {
        await fetch('/api/vote ', {
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
      setIsValid(!isValid);
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
          <div className={s.vote__candidates}>
          {data.map(i => (
            <Card
              style={{ width: 300 }}
              cover={
                <img
                  alt="banner"
                  src={i.img_url}
                />
              }
              actions={[
                <div onClick={() => sendVote(i.id)} style={{'display':'flex','justifyContent': 'center','flexDirection':'row', 'alignItems':'center'}}>
                  <CheckOutlined key="vote" /><p style={{'margin-bottom':'0', 'marginLeft': '5px'}}>Votar</p>
                </div>,
              ]}
            >
              <Meta
                avatar={<Avatar src={i.img_url} />}
                title={i.user_name}
                description={i.description}
              />
            </Card>
          ))}
          </div>
        ) : (
          hasVoted? (
            <Result
              status="success"
              title="Gracias por votar"
            />
          ) : (
            <ul>
              <li>No perteneces a vatspa</li>
              <li>Estás marcado como usuario inactivo</li>
              <li>Ya has votado</li>
            </ul>
          )
        )
      )}      
    </div>
  );
}
