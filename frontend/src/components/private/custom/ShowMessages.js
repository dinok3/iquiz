import React from "react";



const ShowMessages = ({messages})=>{
    return (
        <div className="chat-messages chat-container" >
            {messages.map((message,index)=>{
                return (
                <div key={index} >
                {message.user ?
                    (   <p className="msg" >
                        <span className="bold">{message.user}: </span>{message.message}
                        </p>
                    ) : 
                        <p className="msg muted" >
                        {message.message}
                        </p>
                }
                </div>)
            })}
            
        </div>
    )
}

export default ShowMessages