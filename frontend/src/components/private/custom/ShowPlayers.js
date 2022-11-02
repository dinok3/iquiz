import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import Kick from "../../assets/kick.svg"

const ShowPlayers = ({room_id, setKickPlayer, settings})=>{
    const navigate = useNavigate()
    const [users, setUsers] = useState([])


    useEffect(()=>{
        const activeUsers = async () =>{
            const response = await fetch(`http://127.0.0.1:8000/api/room_users/${room_id}/`)
           .then(res =>res.json())
           .then(data=>{
                setUsers(data)
                return data
            })
           .catch(e=>{
                navigate("/custom/")
           })
           return response
          
       }
       
        //updating users when they join
        var interval = setInterval(activeUsers,2000)

        return () => clearInterval(interval)
            
    },[room_id, navigate, setUsers])


    useEffect(()=>{
        /*
        When users are set - kick the user that is not in the list
        */
        if(users.length > 0){
            var findUser = users.find(e => e.user === localStorage.getItem("user"))
            if(!findUser){
                navigate("/custom/")
            }
        }
    },[users, navigate])

    
    const kickPlayer = async (e)=>{
        const user = e.target.dataset.user
        await fetch(`http://127.0.0.1:8000/api/room/${room_id}/`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("authTokens"))?.access}`
            },
            body:JSON.stringify({
                "user" : user
            })
        })
        .then(res=>{
            if(res.ok){
                setKickPlayer(user)
            }
        })
       
        .catch(e=>{
            console.error("err: ",e)
        })
    }

    return (
        <>
        {users.length === 0 ? 
            <span className="small-spinner mt-1"></span>
        :
            <section className="players mt-3">
                <h3>PLAYERS: </h3>
                <hr></hr>
                {users.map(user=>{
                    return <p className="mt-1 player" key={user.id}>
                            {user.user}
                            {(user.user !== settings.owner && localStorage.getItem("user") === settings.owner) && 
                            <img src={Kick} alt="kick" data-user={user.user} className="small-svg" onClick={kickPlayer} />}
                            </p>
                })}  
            </section>
        }
        </>
    )
}



export default ShowPlayers