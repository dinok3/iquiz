import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";
import NFSettings from "../../assets/UnfilledSettings.svg"

const ShowSettings = ({room_id, setRoomOwner,setSettings, settings})=>{
    const navigate = useNavigate()
    
    
    useEffect(()=>{
        const fetchSettings = async ()=>{
            await fetch(`http://127.0.0.1:8000/api/room/${room_id}/`)
            .then(res=>res.json())
            .then(data=>{
                setSettings(data)
                setRoomOwner(data.owner)
            })
            .catch(e=>{
                navigate("/custom/")
            })
        }
        fetchSettings()
    },[navigate, room_id, setRoomOwner, setSettings])



    return (
        <>
        {settings.length === 0 ? 
            <span className="small-spinner mt-1"></span>
        :
            <section className="players mt-3">
                <h3 style={{display:"flex",justifyContent:"space-between"}}>
                    SETTINGS: <img src={NFSettings} alt="settings.svg" className="small-svg" /> 
                </h3>
                <hr />
                <p className="mt-1 player"><span className="bold">OWNER: </span>{settings.owner}</p>
                <p className="mt-1 player"><span className="bold">CATEGORY:  </span> {settings.category}</p>
                <p className="mt-1 player"><span className="bold">DIFFICULTY: </span> {settings.difficulty}</p>
                <p className="mt-1 player"><span className="bold">TYPE: </span> {settings.type}</p>
                <p className="mt-1 player"><span className="bold">TIME: </span> {settings.time} sec</p>
                <p className="mt-1 player"><span className="bold">ROUNDS: </span> {settings.rounds}</p>
            
            </section>
        }
        </>
    )
}



export default ShowSettings