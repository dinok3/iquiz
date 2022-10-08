import React,{useContext} from "react";
import {Outlet, Navigate } from "react-router-dom";
import AuthContext from "./authentication/AuthProvider";

//matching child is rendered with Outlet

const PublicRoutes = ()=>{

    const {user,responseTokens}  = useContext(AuthContext)

    

    return (!user || !responseTokens) ? <Outlet /> : <Navigate to="/" />
}


export default PublicRoutes
