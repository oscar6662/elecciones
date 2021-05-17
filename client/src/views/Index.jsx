import React, { useState, useEffect  } from 'react';

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
    <div
            className="card"
            style={{ border: `1px solid black`, borderRadius: 2 }}
            onClick={() => window.location = '/api/logout'}
        >
            <div>
                <p style={{ margin: 0, textAlign: "left", padding: "5px 0px 5px 10px" }}>
                    {isLoading ? (
                      <>Loading Content</>
                    ):(
                      <>{data.email}</>
                    )}
                </p>
            </div>

        </div>
  );
}