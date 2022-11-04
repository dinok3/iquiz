import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameOver from "./GameOver";
import { useTimer } from 'use-timer';

import Return from "../../assets/return.svg"


const ShowQuestion = ({questions, websocket, normalGame, timer, room_id})=>{
    const [onQuestion,setOnQuestion] = useState(0)
    const [currentQuestion,setCurrentQuestion] = useState({})
    const [correctAnswer,setCorrectAnswer] = useState("")
    const [answers,setAnswers] = useState([])

    const [gameOver,setGameOver] = useState(false)
    const [score,setScore] = useState(0)
    const [clicked,setClicked] = useState(false)

    const [animate,setAnimate] = useState("fadeIn")
   
    const navigate = useNavigate()

    const { time, start, reset } = useTimer({
        initialTime:timer,
        endTime:0,
        timerType: 'DECREMENTAL',
    }); 


    const decodeQuestionText = (question) =>{
        //"Which famous book is sub-titled &#039;The Modern Prometheus&#039;?" 
        //to
        //"Which famous book is sub-titled 'The Modern Prometheus'?" 
        const new_element = document.createElement("div")
        new_element.innerHTML = question
        return new_element.innerHTML
    }

    const nextQuestion = useCallback(() => {
        onQuestion + 1 < questions.length ? setOnQuestion(curr=> curr+1) : setGameOver(true)
        setClicked(false)
        setAnimate("fadeIn")
    },[questions.length, onQuestion])

    const clearCorrectIncorrect = () => {
        const choices = Array.from(document.getElementsByClassName("answer-choice"))

        choices.forEach(element => {
            element.classList.remove("wrong_answer")
            element.classList.remove("correct_answer")
            element.classList.remove("blink-correct")
        });
    
    }


    const handleAnswer = (e)=>{
        setClicked(true)
        if(clicked) return null
        
        var class_to_add = ""
        
        if(e.target.value === decodeQuestionText(correctAnswer)){
            setScore(prev=>prev+10)
            class_to_add = "correct_answer"
                
        }else{
            class_to_add = "wrong_answer"
            var all_choices = Array.from(e.target.parentElement.childNodes)
            var correct_choice = all_choices.find(choice=>choice.value === decodeQuestionText(correctAnswer))
            correct_choice.classList.add("blink-correct")
        }

        e.target.classList.add(class_to_add)


        if(!normalGame) return;

        setTimeout(()=>{   
            //show new question after 1.5s of pause
            e.target.classList.remove(class_to_add)
            setAnimate("fadeOut")
            correct_choice && correct_choice.classList.remove("blink-correct")

            setTimeout(()=>{
                nextQuestion()
            },500)
        },2500)
        
    }
    

    useEffect(()=>{
        if(!normalGame){
            if(time === 0){
                clearCorrectIncorrect()
                nextQuestion()
                reset()
            }
        }
    },[normalGame, time, reset, nextQuestion])


    useEffect(()=>{
        if(!normalGame){
            start()
        }

        const curr_question = questions[onQuestion]
        //make an array of answers with random position of correct asnwer
        const answers = [...curr_question.incorrect_answers]

        answers.splice(Math.floor(Math.random() * 4),0,curr_question.correct_answer)
        
        setCurrentQuestion(curr_question)
        setCorrectAnswer(curr_question.correct_answer)
        setAnswers(answers)

    },[questions, onQuestion, start, normalGame])


    useEffect(()=>{
        if(websocket){
            websocket.current.send(JSON.stringify({
                "message":"/scoreUpdate",
                "score":score
            }))
        }
    },[score,websocket])


    return (
        <div className="game-container">
            
            {gameOver ?  <GameOver  endscore={score} 
                                    max_score={questions.length*10} 
                                    room_id={room_id} /> :
            
            <div className={`${animate}`}>
            
                <h1>{decodeQuestionText(currentQuestion.question)}</h1>
                
                <section className="additional-data mt-1">
                    <span onClick={()=>{navigate(-1)}} style={{cursor:"pointer"}}>
                        <img src={Return} alt="goback-svg" style={{marginRight:"5px"}} />
                        Go Back
                    </span>
                    { !normalGame && <span style={{color:"var(--dark)"}}>Time: {time}</span>}
                    <span style={{color:"var(--dark)"}}>Score: {score}</span>
                    <span>Round: {onQuestion+1}/{questions.length}</span>
                </section>
                
                <section className="answers-section">
                    {answers.map((answer,index)=>{
                        return  <input  type="button" name="answer" value={decodeQuestionText(answer)} key={index}
                        className="btn middle-btn mt-2 answer-choice"  id={`answer-${index}`}
                        onClick={handleAnswer}/>   
                    })}
                </section>
            </div>
            }
        </div>
    )
}

export default ShowQuestion
