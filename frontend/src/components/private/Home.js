import React,{useEffect} from "react";
import { Link } from "react-router-dom";


const Home = ()=>{
    
    useEffect(()=>{
        //override user that will be set using google and facebook - 
        //they set different username then what is set into a database(will cause issues and complexity)
     
        const fetchUserWithToken = ()=>{
            fetch("http://127.0.0.1:8000/api/user/",{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${JSON.parse(localStorage.getItem("authTokens")).access}`
                },
            }).then(res=>res.json())
            .then(data=>{
                if(data.user === "undefined" || data.user === undefined) return;
                   
                localStorage.setItem("user",data.user)
            
            })
        }
        fetchUserWithToken()
    },[])

    return (
    <>
    <h1>Hello, {localStorage.getItem("user")}!</h1>

    <section className="middle-section">
        <Link to="/normal/" className="btn middle-link">NORMAL GAME</Link>
        <Link to="/custom/" className="btn middle-link mt-2">CUSTOM GAME</Link>
        <Link to="/stats/" className="btn middle-link mt-2">YOUR STATS</Link>
    </section>
    
    
    </>
    )
}

export default Home
