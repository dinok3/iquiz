import React, { useContext, useEffect } from "react";
import {Link} from "react-router-dom"

import Navigation from "../Navigation";
import Balloons from "../assets/Balloons.jpg"
import GoogleIcon from "../assets/GoogleIcon.svg"
import FacebookIcon from "../assets/FacebookIcon.svg"

import AuthContext from "./AuthProvider";
import { GoogleLogin } from 'react-google-login';
import {gapi} from "gapi-script"

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

const style = {
    backgroundImage: `url(${Balloons})`
}


const Login = ()=>{
    const {
        responseGoogle,
        responseFacebook,
        googleSetUp,
        loginUser,
        loginData,

    }  = useContext(AuthContext)

    useEffect(()=>{
        gapi.load("client:auth2",googleSetUp)
    },[googleSetUp])

    return (
        <div className="auth_grid">
            <div className="auth__container">
                
                <Navigation />
                
                <h1>LOGIN HERE!</h1>

                <form action="" className="auth__form register_form" onSubmit={loginUser}>
                    <section>
                        <label htmlFor="username">USERNAME: </label>
                        
                        { loginData.username === undefined ? 
                            <input type="text" name="username" className="btn text-cursor" />  :
                            <>
                            <input type="text" name="username" className="btn red-border text-cursor" /> 
                            <p className="warning-info">{loginData.username}</p>
                            </>
                        }
                        
                    </section>
                    <section>
                        <label htmlFor="username">PASSWORD: </label>
                        { (loginData.detail === undefined && loginData.password === undefined) ? 
                            <input type="password" name="password" className="btn text-cursor" /> :
                            <>
                            <input type="password" name="password" className="btn red-border text-cursor" />
                            <p className="warning-info">{loginData.detail}{loginData.password}</p>
                            </>
                        }
                    </section>

                    <input type="submit" value="LOGIN" name="submit"  className="btn submit-auth-btn" />
                </form>

                <p className="or__p">or</p>

                <section className="oauth__section">
                    <GoogleLogin
                            clientId="1052794811798-m5tm3ubvakq00f7pbt93jram6duvdi43.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            //cookiePolicy={'single_host_origin'}
                            render={renderProps => (
                                <button type="button" className="btn google_auth" onClick={renderProps.onClick}>  
                                    <img src={GoogleIcon} alt="google auth" />
                                    <span>Google</span>
                                </button> 
                                )}
                        />

                    <FacebookLogin
                            appId="1064747410846315"
                            fields="name, email"
                            callback={responseFacebook}
                            render={renderProps => (
                                <button type="button" className="btn facebook_auth" onClick={renderProps.onClick}>  
                                    <img src={FacebookIcon} alt="facebook auth" />
                                    <span>Facebook</span>
                                </button>                      
                              )}
                        />
                </section>

                <p className="form-footer">Don't have an account yet? <Link to="/register/" className="footer-a">Register here!</Link></p>
            </div>
            <div className="image__container" style={style}></div>
        </div>
    )
}

export default Login
