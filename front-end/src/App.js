import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Εισαγωγή όλων των σελίδων
import Admin from './AdminHomepage';
import Operator from './OperatorHomepage';


export default function App(){
  return(      
      <>
        <div className="main_title">
          <h1>Welcome to <em>Highway Interoperability System</em></h1>
        </div>
        <div className="sub_div">
          <Admin />
          <Operator/>
        </div>
      </>
    );
  }
