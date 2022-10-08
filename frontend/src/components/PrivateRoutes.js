import React,{useContext} from "react";
import {Outlet, Navigate } from "react-router-dom";
import AuthContext from "./authentication/AuthProvider";
import Navigation from "./Navigation";
import "./private/Private.css"
//matching child is rendered with Outlet

const PrivateRoutes = ()=>{
    const {user,responseTokens}  = useContext(AuthContext)
    
    
    return (user && responseTokens) ? 
    (
    <div className="container">
        <Navigation />
         <Outlet /> 
    </div>
   
    ) : <Navigate to="/login/" />
}
export default PrivateRoutes
