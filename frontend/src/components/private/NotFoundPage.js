import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = ()=>{
    return (
    <>
        <h1>Not Found Page</h1>
        <Link to="/" style={{marginTop:"2rem"}}>Go back</Link>
    </>
    )
}



export default NotFoundPage