import React, {useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import Return from "../../assets/return.svg"

const deleteRoom = async (room_id) =>{
    await fetch(`http://127.0.0.1:8000/api/room/${room_id}`,{
        method:"DELETE",
        headers:{
            "Authorization":`Bearer ${JSON.parse(localStorage.getItem("authTokens")).access}`
        }
    })
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
    })
}

const checkIfRoomHasPlayers = async (room_id, setErrorMessage) =>{
    const response = await fetch(`http://127.0.0.1:8000/api/room/${room_id}`)
    .then(res=>res.json())
    .then(data=>{
        if(data.profile.length === 0 && data.owner !== localStorage.getItem("user")){
            deleteRoom(room_id)
            setErrorMessage("Room does not exist anymore! Sry...")
            return false
        }else{
            setErrorMessage("")
            return true
        }
    })
    .catch(e=>{
        setErrorMessage("Room does not exist!")
    })
    return response
}

const CreateOrEnter = ()=>{
 
    const navigate = useNavigate()
    const [errorMessage,setErrorMessage] = useState("")
    
    const handleSubmit = (e) =>{
        e.preventDefault()

        const room_id = e.target.childNodes[1].firstElementChild.value

        if(!parseInt(room_id)){
            setErrorMessage("Invalid room id!")
            return;
        }

        const check = async () =>{
            const response = await checkIfRoomHasPlayers(room_id, setErrorMessage)
            if(response){
                navigate(`/custom/room/${room_id}/`)
            }
        }
        check()
    }


    return (
        <>
        <h1>CREATE A NEW GAME OR ENTER A ROOM ID!</h1>

        <section className="additional-data mt-1">
            <span onClick={()=>{navigate(-1)}} style={{cursor:"pointer"}}>
                <img src={Return} alt="goback-svg" style={{marginRight:"5px"}} />
                Go Back
            </span>

            <span>CUSTOM</span>
        </section>

        <form className="mt-5" onSubmit={handleSubmit}>
            <Link to="create/" className="btn middle-link">CREATE A NEW GAME</Link>
            <div className="room-id-div mt-5">
                <input type="text" className="btn" name="room_id" />
                <span>ENTER ROOM ID</span>
                <button type="submit">ENTER</button>
            </div>
            {errorMessage && <p className="mt-1 warning-info">{errorMessage}</p>}
        </form>

        </>
    )
}
export default CreateOrEnter