import "./App.css";
import React from 'react';
import PassAnalysis from "./pages/PassAnalysis.js";
import TollStationPasses from './pages/TollStationPasses.js';
import ChargesBy from "./pages/ChargesBy.js"
import PassesCost from "./pages/PassesCost";
import HealthCheck from "./pages/HealthCheck";


export default function App(){ 
  return(      
      <>
        <div className="main_title">
          <h1>Welcome to <em>Highway Interoperability System</em></h1>
        </div>
        <div className="sub_div">
          <PassAnalysis />
          <TollStationPasses/>
          <ChargesBy/>
          <PassesCost />
          <HealthCheck />
        </div>
      </>
    );
  }
