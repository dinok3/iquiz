import React, { useEffect, useState } from "react";
import { useParams,useNavigate, Link } from "react-router-dom";

import ShowQuestion from "./ShowQuestion";
import fetchQuestions from "../FetchQuestions";


const types = ["multiple","boolean"]
const difficulties = ["hard","medium","easy"]

const checkIfParamsOK = (params,difficulties, types, trivia_categories)=>{
    return (
    !(parseInt(params.amount) > 0 && parseInt(params.amount) <= 50) ||
    (!trivia_categories.find(c => String(c.id) === params.category) && params.category !== "any") ||
    (!difficulties.includes(params.difficulty) && params.difficulty !== "any") ||
    (!types.includes(params.type) && params.type !== "any") 
    )
}


const NormalGame = ({trivia_categories})=>{
    const [spin,setSpin] = useState(true)
    const params = useParams()
    const navigate = useNavigate()
    const [questions,setQuestions] = useState([])


    useEffect(()=>{
        var URL = `https://opentdb.com/api.php?amount=${params.amount}`
        fetchQuestions(URL, params, setQuestions, setSpin, navigate , true)

    }, [params, navigate])


    if(checkIfParamsOK(params,difficulties, types, trivia_categories)){
        return  (
            <>
            <span className="spinner"></span>
            <p className="mt-2">
                No questions found with given settings.
                <Link to="/normal/" style={{color:"#00BFD2"}}> go back!</Link>
            </p>
            </>
        )
    }


    return (
        <>
            {spin ? <span className="spinner"></span> : <ShowQuestion questions={questions} normalGame={true} /> }
            
        </>   
    )
}



export default NormalGame
