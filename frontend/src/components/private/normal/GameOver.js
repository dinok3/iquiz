import React from "react";
import { Link } from "react-router-dom";


const GameOver = ({endscore, max_score}) =>{
    return (
        <div className="game-over-container mt-2">
            <h1>Game Over!</h1>
            <p className="mt-2">You have earned <span className="bold">{endscore} </span> 
            out of <span className="bold">{max_score}</span> points!</p>
            <Link to="/normal/" className="mt-2 underline">Go Back</Link>
            
        </div>
    )
}
export default GameOver