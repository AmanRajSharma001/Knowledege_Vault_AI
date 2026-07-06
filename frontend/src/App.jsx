import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import SideBar from "./components/SideBar"
import NavBar from "./components/NavBar"
// import Trash from "./components/trash"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp";
import MainPage from './components/MainPage';
function MainLayout() {
  const pageData = [
    {
      id: 1,
      title: "New Page",
      icon: "📘",
      createdBy: "user_1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEditedBy: "Virat",
      visibility: "private",
      tags: ["Getting Started"],
      aiEnabled: true,
      children: []
    },
    {
      id: 2,
      title: "The Notion Basics",
      icon: "📘",
      createdBy: "virat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEditedBy: "Virat",
      visibility: "private",
      tags: ["Getting Started"],
      aiEnabled: true,
      children: []
    }
  ]
  
  const [showPage,setShowPage] = useState(null);
  const [PageTitle,setPageTitle] = useState("New Page");
  const [privates, setPrivates] = useState([]);
  const [agents, setAgents] = useState([]); 
  const [name, setName] = useState("Virat");
  
  async function submit(updatedPrivates, updatedAgents) {
    const res = await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name + "_" + Date.now(),
        privates: updatedPrivates || privates,
        agents: updatedAgents || agents
      })
    });
    console.log(await res.json());
  }

  useEffect(()=>{
    async function loadData(){
      const res=await fetch("http://localhost:8000/users");
      const data=await res.json();
      console.log(data)
      setPrivates(data[data.length-1].privates);
      setAgents(data[data.length-1].agents);
    }
  loadData();
  },[]);      //the square bracket is here because it will let the rednder useEffect onece if i provided a nome inside the square bracket then the useEffect work when there is a change in the name
  
  
  const [Pages,setPages] = useState(pageData);
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden',backgroundColor: '#fff'}}>
      <SideBar Pages = {Pages} setPages = { setPages } showPage = {showPage} setShowPage = {setShowPage} PageTitle = {PageTitle} setPageTitle = {setPageTitle} agents={agents} setAgents={setAgents} privates={privates} setPrivates={setPrivates} submit = {submit}/>
      <MainPage Pages = {Pages} showPage = {showPage} PageTitle = {PageTitle} setPageTitle = {setPageTitle} />
      {/* <main style={{ flex: 1, overflow: 'auto', backgroundColor: '#fff'}}>
      </main> */}
    </div>
  );
}

function App() {
  const [signupLogin, setSignupLogin] = useState("signup");
  return (
    <MainLayout />
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Login />} />
    //     <Route path="/SignUp" element={<SignUp />} />
    //     <Route path="/sideBar" element={<MainLayout />} />
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;

