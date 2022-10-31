import React, {useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import Return from "../../assets/return.svg"

const CreateOrEnter = ()=>{
 
    const navigate = useNavigate()
    const [errorMessage,setErrorMessage] = useState("")
    const handleSubmit = (e) =>{
        e.preventDefault()
        const room_id = e.target.childNodes[1].firstElementChild.value
        parseInt(room_id) ? navigate(`/custom/room/${room_id}/`) : setErrorMessage("Invalid room id!")
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