import React,{useState} from "react";


const TypeChoices = ({types, isShown, setIsShown})=>{
    const [type,setType] = useState("Any")
    const [typeId,seTypeId] = useState("")

    
    const handleOptionClick = (e) =>{
        setType(e.target.value)
        seTypeId(e.target.id)
        setIsShown(null)
    }
    return (
        <div className="settings-div mt-2">
                <div 
                className="flex-div" 
                onClick={()=>{
                    isShown !== "type" ? setIsShown("type") : setIsShown(null)
                }}>
                        
                    <input type="button" name="type" className="btn middle-btn" value={type} id={typeId} />
                    <div className="arrow-svg-div" aria-expanded={isShown === "type"}></div>

                </div>
                {isShown &&
                <div className={`settings-choices selection show-${isShown === "type"}`}>
                    <input  type="button" name="type-select" className="settings-choice"  
                            key="default" value="Any" onClick={handleOptionClick}/> 

                    {types.map((type,index)=>{
                        return <input type="button" name="type-select" className="settings-choice"  
                                key={index} id={type === "Multiple Choice" ? "multiple" : "boolean"} 
                                value={type} onClick={handleOptionClick}/>  
                    })}
                </div>
                } 
            </div>
    )
}

export default TypeChoices