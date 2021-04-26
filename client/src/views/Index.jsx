import React from 'react';

export default function Index(){
  return(
    <div
            className="card"
            style={{ border: `1px solid black`, borderRadius: 2 }}
            onClick={() => window.location = 'auth/google'}
        >
            <div>
                <p style={{ margin: 0, textAlign: "left", padding: "5px 0px 5px 10px" }}>
                    test
                </p>
            </div>

        </div>
  );
}