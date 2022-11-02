import React,{useEffect, useState, useRef, useCallback} from "react";
import { useParams, useLocation,Link, useNavigate } from "react-router-dom";

import Return from "../../assets/return.svg"

import NotFoundPage from "../NotFoundPage";
import ShowPlayers from "./ShowPlayers";
import ShowSettings from "./ShowSettings"
import Chat from "./Chat.js"
import CustomGame from "./CustomGame";


const Room = () =>{
    const {room_id} = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const [currentLocation,setCurrentLocation] = useState(location)

    const [messages,setMessages] = useState([])
    const [connecting,setConnectiong] = useState(true)

    const [chatOn,setChatOn]= useState("chat-not-visible")
    const [settings, setSettings] = useState({})
    const [gameOn,setGameOn] = useState(0)
    const [gameStarted,setGameStarted] = useState(false)

    const [kickPlayer,setKickPlayer] = useState("")
    const [roomOwner,setRoomOwner] = useState("")
    
    const ws = useRef(null) 

    
    
    const sendWebsocketMessage = (message)=>{
        if(ws.current){
            ws.current.send(JSON.stringify({
                "message":message
            }))
        }
    }

    const setGameStart = async (isStarted) => {
        /*
            isStarted - "True" or "False"
        */
        await fetch(`http://127.0.0.1:8000/api/room/${room_id}/`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${JSON.parse(localStorage.getItem("authTokens")).access}`
            },
            body:JSON.stringify({
                "is_started":isStarted
            })
        }).then(res=>res.json())
        .then(data=>{
            return data
        })
    }

    
    
    useEffect(()=>{
        
        const checkIfGameAlreadyStarted = async () => {
            await fetch(`http://127.0.0.1:8000/api/room/${room_id}/`)
            .then(res=>res.json())
            .then(data =>{
               if(data.is_started){
                    navigate("/custom/")
                    return;
               }
            
            })
    
        }
        checkIfGameAlreadyStarted()

        ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/${room_id}/?token=${localStorage.getItem("user")}`)
        
        ws.current.onopen = ()=>{
            connecting && setConnectiong(false) 
        }
        
        ws.current.onclose = (e) => {
            console.error('Chat socket closed unexpectedly');
        };
        
        return ()=>{
            if(ws.current.readyState === 2 || !localStorage.getItem("authTokens")){
                ws.current.close()
            }
        }
        
     
    },[connecting, room_id, navigate])

    useEffect(()=>{
        /*
        close websocket on URL change
        */
        return () =>{ 
            location.pathname !== currentLocation.pathname && ws.current.close()
            
        }
    },[location, currentLocation.pathname])

    useEffect(()=>{
        //beacuse of stritc mode it will run it 2 times
        if(ws.current){
            ws.current.onmessage = (e)=>{
                const new_message = JSON.parse(e.data) 

                var message = new_message["message"]

                if(message.includes("/kickplayer")){
                    var msgs = new_message["message"].split(" ")
                    var kicked_user = msgs[1]
                    if(kicked_user === localStorage.getItem("user")){
                        navigate("/custom/") 
                    }
                }


                if(message === "/gameStart"){
                    setGameOn(1)
                    return;
                }


                if(message !== ""){
                    var newMessageFromat = {
                        "user":new_message["user"],
                        "message":new_message["message"]
                    } 
                    setMessages(msg => [...msg, newMessageFromat])
                }
            } 
    
            var timeout = setTimeout(()=>{
                    sendWebsocketMessage("/NewUserJoined")    
            },2000)
            
            return ()=>{clearTimeout(timeout)}
        }
    },[navigate])


    useEffect(()=>{
        if(kickPlayer !== "" && roomOwner === localStorage.getItem("user")){
            sendWebsocketMessage(`/kickplayer ${kickPlayer}`)
        }
    },[kickPlayer, roomOwner])




    const handleMessage = (e)=>{
        e.preventDefault()
        var message = e.target.message.value
        if(message){
            sendWebsocketMessage(message)
        }
        e.target.message.value = ""
    }


    const startGame = () => {
        const userIsOwner = settings.owner === localStorage.getItem("user")
        
        if(userIsOwner){
            setGameStart("True")
            sendWebsocketMessage("/startGame")
        }
    }


    if(!parseInt(room_id)){
        return <NotFoundPage />
    }


    return (
    <>
    { connecting ? 
            <>
            <span className="spinner"></span>
            <p className="mt-2">
                Checking if the room exists.
                <Link to="/custom/" style={{color:"#00BFD2"}}> go back!</Link>
            </p>
            </> 
        :
        <div className="lift-up-div">
           
           <Chat chatOn={chatOn}
                setChatOn={setChatOn} 
                messages={messages} 
                handleMessage={handleMessage}  />
            
            <div className={`full-width-flex show-${gameOn === 0}`}>
                <h1>ROOM ID: {room_id}</h1>
                
                <div className="additional-data-small">
                    <section className="additional-data  mt-1-5">
                        <span onClick={()=>{navigate(-1)}} style={{cursor:"pointer"}}>
                            <img src={Return} alt="goback-svg" style={{marginRight:"5px"}} />
                            Go Back
                        </span>
                        <span>CUSTOM</span>
                    </section>
                    
                    <ShowPlayers room_id={room_id} 
                                setKickPlayer={setKickPlayer}
                                settings={settings} />
                    
                    <ShowSettings   room_id={room_id} 
                                    setRoomOwner={setRoomOwner}
                                    setSettings={setSettings}
                                    settings={settings} />
                    

                    <input type="button" value="START" onClick={startGame} className="btn submit-btn mt-5 mx-auto" />
                </div>
            </div>

            <CustomGame gameOn={gameOn} websocket={ws} settings={settings} />

        </div>
    }
    </>
    )
}

export default Room