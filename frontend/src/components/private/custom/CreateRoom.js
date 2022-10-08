import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom" 

import CategoryChoices from "../normal/CategoryChoices"
import DifficultyChoices from "../normal/DifficultyChoices"
import TypeChoices from "../normal/TypeChoices"

import Footer from "../Footer"


const CreateRoom = ({trivia_categories, difficulties, types})=>{
    const [isShown, setIsShown] = useState(null)
    const navigate = useNavigate()
    const [error,setError] = useState("")

    const createRoom = async (e) =>{
        var category = e.target.category.value
        var difficulty = e.target.difficulty.value
        var type = e.target.type.value
        var time = e.target.time.value
        var rounds = e.target.rounds.value
        var owner_token = JSON.parse(localStorage.getItem("authTokens")).access

        if(rounds > 50 || time > 60){
            rounds > 50 && setError("Rounds must be less or equal to 50!")
            time > 60 && setError("Time must be less or equal to 60!")
            return;  
        } 

        await fetch("http://127.0.0.1:8000/api/create_room/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                category:category,
                difficulty:difficulty,
                type:type,
                time:time,
                rounds:rounds,
                owner_token:owner_token
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data){
                navigate(`/custom/room/${data.id}`)
            }
        })

    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        createRoom(e)
    }
    return (
        <>
        <h1>CREATE A NEW GAME!</h1>
        <section className="additional-data mt-1">
            <Link to="/">Go Back</Link>
            <span>CUSTOM</span>
        </section>
        <form className="middle-section create-room-form" onSubmit={handleSubmit}>
            
            {error && <p className="warning-info mb-2">{error}</p>}
            <CategoryChoices    trivia_categories={trivia_categories}
                                isShown={isShown}
                                setIsShown={setIsShown} />

            <DifficultyChoices    difficulties={difficulties}
                                    isShown={isShown}
                                    setIsShown={setIsShown} />

            <TypeChoices    types={types}
                                isShown={isShown}
                                setIsShown={setIsShown} />

            <div className="settings-div mt-2">
                    <input type="text" name="time" className="btn middle-btn amount-input" placeholder="Time Limit (max=60s)" required />       
            </div>
            <div className="settings-div mt-2">
                    <input type="text" name="rounds" className="btn middle-btn amount-input" placeholder="Rounds (max=50)" required />       
            </div>
            <button type="submit" className="btn submit-btn mt-2">Create</button>

            <Footer />
        </form>
    

        </>
    )
}

export default CreateRoom