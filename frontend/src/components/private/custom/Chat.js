import React from "react";
import ShowMessages from "./ShowMessages";

import ChatIcon from "../../assets/ChatIcon.svg"
import Chat from "../../assets/Chat.svg"
import Kick from "../../assets/kick.svg"

const ChatComponent = ({chatOn, setChatOn, messages, handleMessage})=>{

    const chatSwitch = ()=>{
        if(chatOn === "chat-visible"){
            setChatOn("chat-not-visible")
        }else{
            setChatOn("chat-visible")
        }
    }

    
    return (
        <>
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
        </>
    )
}

export default ChatComponent
