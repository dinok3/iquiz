import React from 'react';
import {Routes,Route} from "react-router-dom"
import './App.css';
import "./components/authentication/Authentication.css"
import PrivateRoutes from './components/PrivateRoutes';
import PublicRoutes from './components/PublicRoutes';

import Register from "./components/authentication/Register"
import Login from "./components/authentication/Login"

import Redirect from './components/Redirect';

import {AuthProvider} from "./components/authentication/AuthProvider"

function App() {


  return (
    <div className='main-div'>

      
      <AuthProvider>
        <Routes>
         
          <Route  element={<PrivateRoutes />} >
            <Route exact path="/*" element={<Redirect />} />
          </Route>

          <Route element={<PublicRoutes />}>
            <Route path="/register/" element={<Register />}></Route>
            <Route path="/login/" element={<Login />}></Route>
          </Route>
        
        </Routes>    
      </AuthProvider>
    </div>
  );
}

export default App;
