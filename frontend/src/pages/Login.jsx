import React from 'react'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiNotion } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FaMicrosoft } from "react-icons/fa";
import { GoPasskeyFill } from "react-icons/go";
import { IoBusinessOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
function Login() {
    const navigate=useNavigate();
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const handleLogin=async()=>{
        try{
            const result=await loginUser({email,password});
            localStorage.setItem("access_token",result.access_token);
            console.log(result)
            navigate("/sideBar");

        }catch (error){
            alert("Invalid email or password")
            console.error(error)
        }
    };
    
  return (
    <div className='login-page'>
        <div className='login-box'>
            <div className='login-top'>
                <SiNotion className='notion-logo'/>
                <h2>Your AI workspace.</h2>
                <h3>Log in to your Notion account</h3>
            </div>
            <div className='login-info'>
                <div className='login-input'>
                    <label htmlFor = "email">Email</label><br/>
                    <input id = "email" type = "email" placeholder='Enter your email address...' value={email} onChange={(e)=>setEmail(e.target.value)} />
                    <input type="password" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <p>Use an organization email to easily collaborate with teammates</p>
                    <button onClick={()=>handleLogin()}>Continue</button>
                </div>
                <div className='login-options'>
                    <fieldset>
                        <legend>or continue with</legend>
                        <button><FcGoogle className='login-google-logo'/> Google</button>
                        <button><FaApple  className='login-apple-logo'/> Apple</button>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                            <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                            <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>
                            Microsoft 
                        </button>
                        <button><GoPasskeyFill className='login-passkey-logo'/> PassKey</button>
                        <button><IoBusinessOutline className='login-sso-logo'/> SSO</button>
                    </fieldset>
                </div>
            </div>
            <div className='login-others'>
                <h3>New user? <button onClick={()=>navigate("./SignUp")}>Sign Up</button></h3>
                <p>By continuing, you acknowledge that you understand and agree to the <button>Terms & Conditions</button> and <button>Privacy Policy</button>.</p>
            </div>
        </div>
    </div>
  )
}

export default Login
