import React, {useEffect,useContext, useState} from "react";
import { Link ,useNavigate, useSearchParams} from "react-router-dom";
import AuthContext from "../../authentication/AuthProvider";

import Footer from "../Footer"

const CreateOrEnter = ()=>{
    const {refreshToken} = useContext(AuthContext)
    const navigate = useNavigate()
    const [errorMessage,setErrorMessage] = useState("")
    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log(e.target)
        console.log(e.target.childNodes[1].firstElementChild.value)
        const room_id = e.target.childNodes[1].firstElementChild.value
        parseInt(room_id) ? navigate(`/custom/room/${room_id}/`) : setErrorMessage("Invalid room id!")
    }

    useEffect(()=>{
        const response = async ()=>{
             await fetch("http://127.0.0.1:8000/api/routes/",{
                method:"GET",
                headers:{
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("authTokens")).access}`
                }
            }).then(res => res.json())
            .then(data=>{
                console.log(data)
            })

        }

        response()
    },[refreshToken])

    return (
        <>
        <h1>CREATE A NEW GAME OR ENTER A ROOM ID!</h1>
        <section className="additional-data mt-1">
            <Link to="/">Go Back</Link>
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
        <Footer />
        </>
    )
}
export default CreateOrEnter