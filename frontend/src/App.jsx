import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import SideBar from "./components/SideBar"
import NavBar from "./components/NavBar"
import Trash from "./components/trash"

import Login from "./components/Login"
import SignUp from "./components/SignUp";
function App() {
  const [count, setCount] = useState(0)
  const message="hello";
  const [Active,SetActive]=useState("")
  const [signupLogin,setSignupLogin] = useState("signup");
  return (

    <SideBar />
  //  <BrowserRouter>
  //  <Routes>
  //   {/* <Route path="/" element={<LandingPage />}/> */}
  //   <Route path="/" element={<Login />}/>
  //   <Route path="/SignUp" element={<SignUp />}/>
  //  </Routes>
  //  </BrowserRouter>
  );
}

export default App;
