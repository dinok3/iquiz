import React, { useState } from "react";
import {useNavigate} from "react-router-dom";

import CategoryChoices from "./CategoryChoices";
import DifficultyChoices from "./DifficultyChoices";
import TypeChoices from "./TypeChoices";
import Return from "../../assets/return.svg"

const NormalGameSettings = ({trivia_categories, difficulties, types})=>{
    //toggle show options/choices for specific input
    const [isShown,setIsShown] = useState(null)
   
    const navigate = useNavigate()
    
    const formSubmit = (e)=>{
        e.preventDefault()
        const amount = e.target.amount.value
        const category = e.target.category.id === "" ? "any" : e.target.category.id
        const difficulty = e.target.difficulty.id === "" ? "any" : e.target.difficulty.id
        const type = e.target.type.id === "" ? "any" : e.target.type.id
    
        navigate(`/normal/${amount}/${category}/${difficulty}/${type}/`)  
         
    }

    
    
    return (
        <>
        <h1>CHOOSE HOW YOU WANT TO PLAY A GAME!</h1>
        <section className="additional-data mt-1">
            <span onClick={()=>{navigate(-1)}} style={{cursor:"pointer"}}>
                <img src={Return} alt="goback-svg" style={{marginRight:"5px"}} />
                Go Back
            </span>

            <span>NORMAL</span>
        </section>
        <form onSubmit={formSubmit} className="middle-section">
            
            <CategoryChoices    trivia_categories={trivia_categories} 
                                isShown={isShown} 
                                setIsShown={setIsShown} />

            <DifficultyChoices  difficulties={difficulties}
                                isShown={isShown} 
                                setIsShown={setIsShown}/>

            <TypeChoices    types={types}
                            isShown={isShown}
                            setIsShown={setIsShown}/>
            

            <div className="settings-div mt-2">          
                <input type="text" name="amount" placeholder="amount (max=50 questions)"  className="btn middle-btn amount-input" required />
            </div>


            <button type="submit" className="btn submit-btn mt-2">Play</button>
        </form>

        </>
    )
}

export default NormalGameSettings
