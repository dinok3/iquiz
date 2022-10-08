import React from "react";
import { Link } from "react-router-dom";

const Footer = ()=>{
    return (
        <p className="contribute-msg mt-3">
            If you have a good quiz question, 
            <Link to="/" className="footer-a"> click here </Link> 
            to submit it and if its approved it will be added to a database!
        </p>
    )
}

export default Footer