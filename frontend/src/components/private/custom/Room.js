import React,{useEffect, useState, useRef} from "react";
import { useParams, useLocation,Link, useNavigate } from "react-router-dom";


import NotFoundPage from "../NotFoundPage";
import ShowPlayers from "./ShowPlayers";
import ShowSettings from "./ShowSettings"
import ShowMessages from "./ShowMessages";

import ChatIcon from "../../assets/ChatIcon.svg"
import Chat from "../../assets/Chat.svg"
import Kick from "../../assets/kick.svg"


const Room = () =>{
    const {room_id} = useParams()
    const location = useLocation()
    const [currentLocation,setCurrentLocation] = useState(location)

    const [messages,setMessages] = useState([])
    const [connecting,setConnectiong] = useState(true)

    const [chatOn,setChatOn]= useState("chat-not-visible")

    const ws = useRef(null) 
    const navigate = useNavigate()

    const [kickPlayer,setKickPlayer] = useState("")
    const [roomOwner,setRoomOwner] = useState("")

    useEffect(()=>{
        ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/${room_id}/?token=${localStorage.getItem("user")}`)
        
        ws.current.onopen = ()=>{
            console.log("Websocket Connected")
            connecting && setConnectiong(false) 
        }

        ws.current.onclose = (e) => {
            console.error('Chat socket closed unexpectedly');
        };
        
        return ()=>{
            if( location.pathname !== currentLocation.pathname || 
                ws.current.readyState === 2 || 
                !localStorage.getItem("authTokens")
            ){
                ws.current.close()
            }
        }
    
    },[connecting, room_id, location, currentLocation])


    useEffect(()=>{
        //beacuse of stritc mode it will run it 2 times
        ws.current.onmessage = (e)=>{
            const new_message = JSON.parse(e.data) 
           
            if(new_message["message"].includes("/kickplayer")){
                var msgs = new_message["message"].split(" ")
                var kicked_user = msgs[1]
                if(kicked_user === localStorage.getItem("user")){
                    console.log("navigate")
                    navigate("/custom/") 
                }
            }
            var newMessageFromat = {
                "user":new_message["user"],
                "message":new_message["message"]
            } 
            setMessages(msg => [...msg, newMessageFromat])
        } 

        var timeout = setTimeout(()=>{
            if(ws.current){
                console.log("sent")
                ws.current.send(JSON.stringify({
                    "message":"NewUserJoined"
                }))
            }
        },2000)
        
        return ()=>{clearTimeout(timeout)}
    },[navigate])

    useEffect(()=>{
        if(kickPlayer !== "" && roomOwner === localStorage.getItem("user")){
            ws.current.send(JSON.stringify({
                "message":`/kickplayer ${kickPlayer}`,
            }))
        }
    },[kickPlayer, roomOwner])

    const chatSwitch = ()=>{
        if(chatOn === "chat-visible"){
            setChatOn("chat-not-visible")
        }else{
            setChatOn("chat-visible")
        }
    }


    const handleMessage = (e)=>{
        e.preventDefault()
        var message = e.target.message.value
        if(message){
            ws.current.send(JSON.stringify({
                "message":message
            }))
        }
        e.target.message.value = ""
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
                <div className={`chat ${chatOn}`}>
                    <div className="chat-top chat-container">
                        <img src={Chat} alt="chatIcon" />
                        <span>Chat</span>
                        <img src={Kick} alt="close-svg" onClick={chatSwitch} className="chat-kick" />
                    </div>
                    <hr />
                    
                    <ShowMessages messages={messages} />

                    <form className="send-msg-form" onSubmit={handleMessage}>
                        <input type="text" name="message" />
                        <input type="submit" value="Send" name="chatSubmit" className="btn" />
                    </form>
                </div>
                
                <img src={ChatIcon} alt="chat-icon" className="chat-icon" onClick={chatSwitch} />
                
                <h1>ROOM ID: {room_id}</h1>
                <div className="additional-data-small">
                    <section className="additional-data  mt-1-5">
                        <Link to="/">Go Back</Link>
                        <span>CUSTOM</span>
                    </section>
                    
                    <ShowPlayers room_id={room_id} setKickPlayer={setKickPlayer} />
                    
                    <ShowSettings room_id={room_id} setRoomOwner={setRoomOwner} />
                    

                    <input type="button" value="START" className="btn submit-btn mt-5 mx-auto" />
                </div>
            </div>
    }
    </>
    )
}

export default Room