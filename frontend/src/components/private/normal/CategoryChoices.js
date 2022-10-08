import React,{useState} from "react";


const CategoryChoices = ({trivia_categories,isShown,setIsShown})=>{

    const [category,setCategory] = useState("Any")
    const [categoryId,setCategoryId] = useState("")

    const handleOptionClick = (e) =>{
        setCategory(e.target.value)
        setCategoryId(e.target.id)
        setIsShown(null)
    }
    
    return (
        <div className="settings-div">
            <div className="flex-div" onClick={()=>{
                isShown !== "category" ? setIsShown("category") : setIsShown(null)
            }}>

                <input type="button" name="category" className="btn middle-btn" value={category} id={categoryId} />
                <div className="arrow-svg-div" aria-expanded={isShown === "category"}> </div>
            
            </div>

            {isShown && 
            <div className={`settings-choices selection show-${isShown === "category"}`}>
                <input  type="button" name="categoryselect" className="settings-choice"  
                        key="any" value="Any" onClick={handleOptionClick}/> 
                
                {trivia_categories.map(category=>{
                    return <input type="button" name="categoryselect" className="settings-choice" 
                                key={category.id} id={category.id} value={category.name} 
                                onClick={handleOptionClick} />                
                })}
                
            </div>
            } 
        </div>
    )
}

export default CategoryChoices