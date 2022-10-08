import React,{useState} from "react";


const DifficultyChoices = ({difficulties, isShown,setIsShown})=>{

    const [difficulty,setDifficulty] = useState("Any")
    const [difficultyId,setDifficultyId] = useState("")

    
    const handleOptionClick = (e) =>{
        setDifficulty(e.target.value)
        setDifficultyId(e.target.id)
        setIsShown(null)
    }
    return (
        <div className="settings-div mt-2">
            <div className="flex-div" onClick={()=>{
                isShown !== "difficulty" ? setIsShown("difficulty") : setIsShown(null)
            }}>

                <input type="button" name="difficulty" className="btn middle-btn" value={difficulty} id={difficultyId} />
                <div className="arrow-svg-div" aria-expanded={isShown === "difficulty"}></div>
            
            </div>
            {isShown &&
            <div className={`settings-choices selection show-${isShown === "difficulty"}`}>
                {/* first one is any, others are fetched */}
                <input  type="button" name="difficulty-select" className="settings-choice"  
                        key="default" value="Any" id="any" onClick={handleOptionClick}/> 

                {difficulties.map((difficulty,index)=>{
                    return <input   type="button" name="difficulty-select" className="settings-choice"  
                                    key={index} id={difficulty.toLowerCase()} value={difficulty}
                                    onClick={handleOptionClick}/>  
                })}
            </div>
            } 
        </div>
    )
}

export default DifficultyChoices