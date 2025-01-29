import React from 'react';
import PassesCost from "./pages/PassesCost";
import HealthCheck from "./pages/HealthCheck";


export default function App(){
  return(      
      <>
        <div className="main_title">
          <h1>Welcome to <em>Highway Interoperability System</em></h1>
        </div>
        <div className="sub_div">
          <PassesCost />
          <HealthCheck />
        </div>
      </>
    );
  }
