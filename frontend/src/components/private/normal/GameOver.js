import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const setIsStartedToFalse = async (room_id) =>{
    /* 
    when game finishes allow users to join in the room
    */
   
   await fetch(`http://127.0.0.1:8000/api/room/${room_id}/`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${JSON.parse(localStorage.getItem("authTokens")).access}`
        },
        body:JSON.stringify({
            "is_started":"False"
        })
    })
    .catch(e=>{
        console.log(e)
    })
}

const GameOver = ({endscore, max_score, room_id}) =>{
    
    const navigate = useNavigate()

    useEffect(()=>{
        setIsStartedToFalse(room_id)
    },[room_id])

    return (
        <div className="game-over-container mt-2">
            <h1>Game Over!</h1>
            <p className="mt-2">You have earned <span className="bold">{endscore} </span> 
            out of <span className="bold">{max_score}</span> points!</p>
            <span onClick={()=>{
                if(room_id){
                    window.location.reload()
                }else{
                    navigate(`/normal/`)
                }
                }} style={{marginTop:"2rem",cursor:"pointer",textDecoration:"underline"}}>
            Go Back
            </span>
            
        </div>
    )
}
export default GameOver