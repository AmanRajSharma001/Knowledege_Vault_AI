import React from 'react'
import {SiNotion} from "react-icons/si";
function SignUp() {
  return (
    <div className='signUpPage'>
      <div className='signUpCard'>
        <SiNotion size={32} className="notion-icon"/>
        <h1>Notion: your AI workspace.</h1>        
        <h2>Sign up with your work email</h2>
        <label>work email</label>
        <input type="email" placeholder='name@company.com'></input>
        <div className='tipbox'>
          <strong>Tip:Use your work email </strong>(if you have one) so
          it's easier for your team to join you on Notion 
        </div>
        <button className='continue-btn'>
          Continue
        </button>
        <div className='divider'>
          or continue with
        </div>
        <div className='google-microsoft'>
          <button className="google">
            <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4C12.9 4 4 12.9 4 24s8.9 20 20 20s20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.1 7.1l6.2 5.2C39.1 36.9 44 31 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
            Google
          </button>
          <button className='microsoft'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>
            Microsoft
          </button>
 
        </div>
        <div className="bottom">
          Existing user?
          <button>Log in</button>
        </div>
        <p>By continuing,you acknowledge that you understand<br/>
            and agree to the Terms & Conditions and Privacy Policy
        </p>
      </div>

        
    </div>
  )
}

export default SignUp
