import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchQuestions from "../FetchQuestions";
import ShowQuestion from "../normal/ShowQuestion";


const CustomGame = ({gameOn, websocket, settings})=>{
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const [spin,setSpin] = useState(true)
    
    const [userScores,setUserScores] = useState([])
    const [usersSet,setUsersSet] = useState(false)
    

    useEffect(()=>{
        if(gameOn){
            const URL = `https://opentdb.com/api.php?amount=${settings.rounds}`
           
           
            fetchQuestions(URL, settings, setQuestions, setSpin, navigate, false)

            var profiles = settings.profile

            profiles.forEach(element => {
                setUserScores(prevScores => [...prevScores, {
                    name:element,
                    score:0
                }])
            });

            setUsersSet(true)
          
        
        }
    },[settings, navigate, gameOn])


    useEffect(()=>{
        websocket.current.onmessage = (e)=>{
            var returnedMessage = JSON.parse(e.data)
            if(returnedMessage["score"]){
                var user = returnedMessage["user"]
                var score = returnedMessage["score"]
              
                if(usersSet){
                    setUserScores(prevScores=>{   
                        var findUser = prevScores.find(e => e.name === user)
                        findUser.score = score
                        return [...prevScores]
                    })
                }
               
               
            }
        }
    },[websocket,usersSet])

    
    return (

        <div id="gameStart" className={`show-${gameOn === 1}`}>
            {!spin && <ShowQuestion 
                        questions={questions} 
                        websocket={websocket} 
                        normalGame={false} 
                        timer={settings.time} />}
            {usersSet &&
            <div className="scoreboard-section">
                <h2>Scoreboard</h2>

                {userScores.map((user,index)=>{
                    return <p key={index}>{user.name} : <span className="pts">{user.score} pts</span></p>  
                })
                }

            </div>
            }
        </div>

    )
}

export default CustomGame