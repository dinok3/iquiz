import React,{useContext} from "react";
import { Link } from "react-router-dom";
import Logo from "./assets/Logo.svg"
import AuthContext from "./authentication/AuthProvider";

const Navigation = ()=>{

    const {logoutUser,user} = useContext(AuthContext)

    return (
    <div className="navigation-div">
        <Link to="/" >
            <img src={Logo} alt="logo" />
            <span><span className="logo-red">IQ</span>uiz</span>
        </Link>
        {user && <p onClick={logoutUser} style={{cursor:"pointer"}}>Logout</p>}
    </div>
    )
}




export default Navigation