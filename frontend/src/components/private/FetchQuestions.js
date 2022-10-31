


const fetchQuestions = async (URL, params, setQuestions, setSpin, navigate, shouldNavigate)=>{

    var category = params.category
    var difficulty = params.difficulty.toLowerCase()
    var type = params.type.toLowerCase()


    if(category !== "any"){
        URL += `&category = ${category}`
    }
    if(difficulty !== "any"){
        URL += `&difficulty = ${difficulty}`
    }

    if(type !== "any"){
        if(params.type === "Multiple Choices"){
            URL += `&type = multiple`
        }
        else if (params.type === "True/False"){
            URL += `&type = boolean`
        }
    }else{
        URL += `&type = any`
    }
    

    await fetch(URL)
        .then(res=>res.json())
        .then(data=>{
            if(data.response_code !== 0){
                if(shouldNavigate){
                    navigate("/normal/")
                }
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


export default fetchQuestions