import React,{useContext, useEffect} from "react";
import AuthContext from "../authentication/AuthProvider";
import { Link } from "react-router-dom";


const Home = ()=>{
    const {
        user,
    } = useContext(AuthContext)
    
    useEffect(()=>{
        //override user that will be set using google and facebook - 
        //they set different username then what is set into a database(will cause issues and complexity)
        const fetchUserWithToken = ()=>{
            console.log(JSON.parse(localStorage.getItem("authTokens")).access)
            fetch("http://127.0.0.1:8000/api/user/",{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${JSON.parse(localStorage.getItem("authTokens")).access}`
                }
            }).then(res=>res.json())
            .then(data=>{
                localStorage.user = data.user
                return data.user
            })
        }
        fetchUserWithToken()
    },[])

    return (
    <>
    <h1>Hello, {user}!</h1>

    <section className="middle-section">
        <Link to="/normal/" className="btn middle-link">NORMAL GAME</Link>
        <Link to="/custom/" className="btn middle-link mt-2">CUSTOM GAME</Link>
        <Link to="/stats/" className="btn middle-link mt-2">YOUR STATS</Link>
    </section>
    
    <p className="contribute-msg">If you have a good quiz question, 
        <Link to="" className="footer-a"> click here </Link> 
        to submit it and if its approved it will be added to a database!</p>
    </>
    )
}

export default Home
