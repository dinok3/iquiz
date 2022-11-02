import React, { useEffect, useState ,useContext } from "react";

import { Route,Routes, useLocation } from "react-router-dom";

import NormalGameSettings from "./private/normal/NormalGameSettings"
import Home from "./private/Home"
import NotFoundPage from "./private/NotFoundPage"
import NormalGame from "./private/normal/NormalGame"

import CreateOrEnter from "./private/custom/CreateOrEnter";
import Room from "./private/custom/Room";
import CreateRoom from "./private/custom/CreateRoom";

import AuthContext from "./authentication/AuthProvider";

const difficulties = ["Hard","Medium","Easy"]
const types = ["True/False","Multiple Choices"]


const Redirect = ()=>{
    
    
    const {responseTokens,refreshToken,loading} = useContext(AuthContext)

    const location = useLocation()
    const [displayLocation,setDisplayLocation] = useState(location)
    const [animationType,setAnimationType] = useState("fadeIn")

    const [trivia_categories,setTriviaCategories] = useState([])

    
    useEffect(()=>{
        
        const fetchCategories = async ()=>{
            await fetch("https://opentdb.com/api_category.php")
            .then(res=>res.json())
            .then(data=>{
                setTriviaCategories(data.trivia_categories)
            })
            .catch(e=>{
                console.log("API categories error: ",e)
            })
           
        }
        fetchCategories()
    },[])

  

    useEffect(()=>{
        //on first load refresh because interval doesnt work when app is closed
        if(loading){
            console.log("refreshing...")
           refreshToken()
        }
        
        //every 19 minutes and 30 seconds refresh token = 1170000 ms
        var interval= setInterval(()=>{
           if(responseTokens){
               refreshToken()
           }
        },1170000)

        return ()=>clearInterval(interval)

    },[responseTokens,refreshToken, loading])

    
    useEffect(()=>{

        location !== displayLocation && setAnimationType("fadeOut")

    },[location,displayLocation])

    
    return (
        <>
        {loading ? null : 
        <div 
            className={`${animationType} middle-div`} 
            onAnimationEnd={()=>{
                setDisplayLocation(location)
                setAnimationType("fadeIn")          
            }}>
        
            <Routes location={displayLocation}>
                <Route path="/" element={<Home />} />
                <Route path="/normal/" element={<NormalGameSettings 
                                        trivia_categories={trivia_categories} 
                                        difficulties={difficulties}
                                        types={types}  />} />

                <Route exact path="/normal/:amount/:category/:difficulty/:type/" 
                                element={<NormalGame trivia_categories={trivia_categories}  />} />

                <Route path="/custom/" element={<CreateOrEnter />} />
                <Route  path="/custom/create/" 
                        element={<CreateRoom 
                                        trivia_categories={trivia_categories} 
                                        difficulties={difficulties}
                                        types={types} />} 
                        />
                
                <Route exact path="/custom/room/:room_id/" element={<Room />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

        </div>}
        </>
        
        )
}
export default Redirect
