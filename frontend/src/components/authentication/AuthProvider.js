import React,{createContext,useState} from "react";
import {useNavigate} from "react-router-dom"
import {gapi} from "gapi-script"

import jwt_decode from "jwt-decode"

const AuthContext = createContext()
export default AuthContext

var CLIENT_ID = "bwdCM43BID52cUJjoc5aBLr3Rz1J4tzBpZHetnly"
var CLIENT_SECRET = "snEUfDNFoXeoA9B3fnqmObyXjsDj2HRnO68eFCyUSAlRm3E8wISVTNqWSh2Twfb1mngcc6HuuK2ppsClK2HXXHHnsnPJ1JTR1BemFmPlIuiCESgHuBVs9pWJIA7v1DTS"


export const AuthProvider = ({children})=>{
    var initialTokens = localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null
    
    const [responseTokens,setResponseTokens] = useState(initialTokens)
    const [user,setUser] = useState(localStorage.getItem("user"))

    const navigate = useNavigate()

    //for control of error messages
    const [registerData,setRegisterData] = useState({})
    const [loginData,setLoginData] = useState({})

    const [loading,setLoading] = useState(true)


    const handleJWTResponse = (data) =>{
        setResponseTokens(data)
        setUser(jwt_decode(data.access).username)
        localStorage.setItem("authTokens",JSON.stringify(data))
        localStorage.setItem("user",jwt_decode(data.access).username)
    }

    const handleSocialResponse = (data,user)=>{  
        var new_data = {
            access: data.access_token,
            refresh: data.refresh_token
        }
        new_data = JSON.stringify(new_data)
        
        if(new_data !== "{}"){
            setResponseTokens(new_data)
            localStorage.setItem("authTokens",new_data)
            localStorage.setItem("user",user)
        }
        !localStorage.getItem("authTokens") && navigate("/")                   
    }


    const registerUser = async (e)=>{
        e.preventDefault();
        
        await fetch("http://127.0.0.1:8000/api/register/",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json", 
                },
                body:JSON.stringify({
                    "username":e.target.username.value,
                    "password":e.target.password.value,
                    "password2":e.target.password2.value
                })
            })
        .then(res=>{
            res.status === 201 && navigate("/login/")
 
            return res.json()
        })
        .then(data=>{
            setRegisterData(data)
        })
        .catch(error=>{
            console.log("Something went wrong: ",error)
        }) 
    }

    const loginUser = async (e)=>{
        
        e.preventDefault()
        await fetch("http://127.0.0.1:8000/api/token/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username:e.target.username.value,
                password:e.target.password.value,
            })
        })
        .then(res=>{
            res.status === "200" && navigate("/")
            return res.json()
        })
        .then(data=>{
            setLoginData(data)
            if(!localStorage.getItem("authTokens")){
                handleJWTResponse(data)
            }
            
            return data
        })
        .catch(e=>{
            console.log("Login user failed: ",e)
        })
    }

    const logoutUser = ()=>{
        setResponseTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        localStorage.removeItem("user")
        
    }

    const refresh_jwt = async (tokens)=>{
        await fetch("http://127.0.0.1:8000/api/token/refresh/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                //logout user if there are no tokens.better then consoling error
                refresh:tokens?.refresh
            })
        }).then(res=>res.json())
        .then(data=>{
            
            handleJWTResponse(data) 
        })
        .catch(e=>{
            //logoutUser()
            // donest work in stict mode becasue of too fast requests
            console.log("refresh doesnt work")
        })
    }

    const refresh_socialToken = async (tokens) =>{
        
        await fetch("http://127.0.0.1:8000/auth/token",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                grant_type: "refresh_token",
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: tokens?.refresh,
            })
            })
        .then(res=>res.json())
        .then(data=>{    
            handleSocialResponse(data,user)
        })
        .catch(e=>{
            //logoutUser()
            console.log("refresh doesnt work")
            })
    }

    const refreshToken = () => {
        var authTokens = JSON.parse(localStorage.getItem("authTokens")) 
        
        authTokens.refresh.length > 50 ? refresh_jwt(authTokens) : refresh_socialToken(authTokens)   
        loading && setLoading(false)  
    }

    const responseGoogle = async (googleResponse) =>{
        console.log(googleResponse)
        await fetch("http://127.0.0.1:8000/auth/convert-token",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                token:String(googleResponse.accessToken),
                backend:"google-oauth2",
                grant_type:"convert_token",
                client_id:CLIENT_ID,
                client_secret:CLIENT_SECRET
            })
        })
        .then(res =>{
            return res.json()
        })
        .then(data =>{
            console.log(data)
            handleSocialResponse(data,googleResponse.profileObj.name)
            setUser(googleResponse.profileObj.name)
        })
        .catch(e=>{
            console.log("Google OAuth2 went wrong: ",e)
        })

    }
    
    const responseFacebook = async (fbresponse) => {
        // now u send a POST request to auth/convert-token and django will create a user and log him in(return access and refresh token)
       
        console.log(fbresponse)
        await fetch("http://127.0.0.1:8000/auth/convert-token",{
            method:"POST",
            headers:{
                "Content-Type":"Application/json",
            },
            body:JSON.stringify({
                token:fbresponse.accessToken,
                backend:"facebook",
                username:fbresponse.name,
                grant_type:"convert_token",
                client_id:"bwdCM43BID52cUJjoc5aBLr3Rz1J4tzBpZHetnly",
                client_secret:"snEUfDNFoXeoA9B3fnqmObyXjsDj2HRnO68eFCyUSAlRm3E8wISVTNqWSh2Twfb1mngcc6HuuK2ppsClK2HXXHHnsnPJ1JTR1BemFmPlIuiCESgHuBVs9pWJIA7v1DTS"
            })
        })
        .then(res=>{
            res.status === 200 && navigate("/")
            return res.json()
        })
        .then(data=>{
            handleSocialResponse(data,fbresponse.name)
            setUser(fbresponse.name)
        })
        .catch(e=>{
            console.log("Facebook OAuth went wrong: ",e)
        })
    }

    const googleSetUp = ()=>{
        gapi.auth2.init({
            client_id:"1052794811798-m5tm3ubvakq00f7pbt93jram6duvdi43.apps.googleusercontent.com"
        })
    }
    
    const ProviderValue = {
        registerUser: registerUser,
        loginUser:loginUser,
        
        //errors
        registerData:registerData,
        loginData:loginData,

        //oauth
        responseFacebook:responseFacebook,
        responseGoogle:responseGoogle,
        googleSetUp:googleSetUp,
        
        //global variables
        responseTokens:responseTokens,
        logoutUser:logoutUser,
        user:user,

        refreshToken:refreshToken,
        loading:loading
    }


    return (
        <AuthContext.Provider value={ProviderValue}>
            {children}
        </AuthContext.Provider>
    )
}

