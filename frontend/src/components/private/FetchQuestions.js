const categoryNameToId = async (category) =>{
    var response = await fetch("https://opentdb.com/api_category.php")
    .then(res=>res.json())
    .then(data=>{
        return data["trivia_categories"]
    })

    return response.find(element => element.name === category).id
}


const fetchQuestions = async (URL, params, setQuestions, setSpin, navigate, shouldNavigate)=>{
    /*
    shouldNavigate = true -> normal game
    shouldNavigate = false -> custom game

    */
    var category = params.category
    var difficulty = params.difficulty.toLowerCase()
    var type = params.type.toLowerCase()

    if(category.toLowerCase() !== "any"){
        if(shouldNavigate){
            category = params.category
        }else{
            category = await categoryNameToId(params.category)
        }
        URL += `&category=${category}`
    }
    
    if(difficulty !== "any"){
        URL += `&difficulty=${difficulty}`
    }

    if(type !== "any"){
        if(params.type === "Multiple Choices"){
            URL += `&type=multiple`
        }
        else if (params.type === "True/False"){
            URL += `&type=boolean`
        }
    }
    
    await fetch(URL)
        .then(res=>res.json())
        .then(data=>{
            if(data.response_code !== 0){
                if(shouldNavigate){
                    navigate("/normal/")
                }else{
                    navigate(-1)
                }
            }
            if(data.results.length > 0){
                setQuestions(data.results)
                setSpin(false)
            }
        
        })
        .catch(e=>{
            console.error(e)
        })
    }


export default fetchQuestions