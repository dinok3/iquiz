import React, { useEffect, useState } from "react";
import { useParams,useNavigate, Link } from "react-router-dom";

import ShowQuestion from "./ShowQuestion";
const types = ["multiple","boolean"]
const difficulties = ["hard","medium","easy"]

const NormalGame = ({trivia_categories})=>{
    const [spin,setSpin] = useState(true)
    const params = useParams()
    const navigate = useNavigate()
    const [questions,setQuestions] = useState([])

    const checkIfParamsOK = (params,difficulties, types)=>{
        return (
        !(parseInt(params.amount) > 0 && parseInt(params.amount) <= 50) ||
        (!trivia_categories.find(c => String(c.id) === params.category) && params.category !== "any") ||
        (!difficulties.includes(params.difficulty) && params.difficulty !== "any") ||
        (!types.includes(params.type) && params.type !== "any") 
        )
    }


    useEffect(()=>{
        const URL = `https://opentdb.com/api.php?amount=${params.amount}`
        const fetchQuestions = async(URL)=>{
            if(params.category !== "any"){
                URL += `&category=${params.category}`
            }
            if(params.difficulty !== "any"){
                URL += `&difficulty=${params.difficulty}`
            }
            if(params.type !== "any"){
                URL += `&type=${params.type}`
            }
            await fetch(URL)
                .then(res=>res.json())
                .then(data=>{
                    if(data.response_code !== 0){
                        navigate("/normal/")
                    }
                    if(data.results.length > 0){
                        setQuestions(data.results)
                        setSpin(false)
                    } 
                })
                .catch(e=>{
                    console.log(e)
                })
            }
        

        fetchQuestions(URL)
    }, [params.category, params.difficulty, params.type, params.amount, navigate])

    if(checkIfParamsOK(params,difficulties, types)){
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
