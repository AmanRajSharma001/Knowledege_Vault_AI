
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import React, { useState, useRef, useEffect, useCallback } from "react";
import SideBar from "./components/SideBar"
<<<<<<< HEAD
import NavBar from "./components/NavBar"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp";
import MainPage from './components/MainPage';
import AiPanel from './components/AiPanel';
=======
import MainPage from './components/MainPage';
// import Trash from "./components/trash"

>>>>>>> upstream/main
function MainLayout() {
  // const [currentType,setCurrentType]=useState("Private")
  const [showPage,setShowPage] = useState(null);
  const [privates, setPrivates] = useState([]);
  const [agents, setAgents] = useState([]); 
  const [pagetype,setPagetype]=useState("Private")
  const [name, setName] = useState("Virat");
  
  // -----------------------merging sidebar aggent and private with mainpage title------------------------
  const [pages, setpages] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const titleInputRef = useRef(null);
  const pagedataInputRef = useRef(null);

  useEffect(() => {
    if (activeId != null) {
      titleInputRef.current?.focus();
    }
<<<<<<< HEAD
  loadData();
  },[]);
  
  
  const [Pages,setPages] = useState(pageData);
  const [showAI, setShowAI] = useState(false);
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden',backgroundColor: '#191919'}}>
      <SideBar Pages = {Pages} setPages = { setPages } showPage = {showPage} setShowPage = {setShowPage} PageTitle = {PageTitle} setPageTitle = {setPageTitle} agents={agents} setAgents={setAgents} privates={privates} setPrivates={setPrivates} submit = {submit}/>
      <MainPage Pages = {Pages} showPage = {showPage} PageTitle = {PageTitle} setPageTitle = {setPageTitle} showAI={showAI} setShowAI={setShowAI} />
      {showAI && <AiPanel onClose={() => setShowAI(false)} />}
=======
  }, [activeId]);

  const addPage = useCallback(() => {
    const id = Date.now();
    setpages(prev => [...prev, { id, title: "", pagedata: "" }]);
    setActiveId(id); // triggers the useEffect above -> focuses title
  }, []);

  const updatePage = useCallback((id, field, value) => {
    setpages(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  }, []);

  const activePage = pages.find(p => p.id === activeId) || null;
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden',backgroundColor: '#fff'}}>
      <SideBar  setpages = { setpages } showPage = {showPage} setShowPage = {setShowPage}
       pagetype={pagetype} setPagetype={setPagetype}
       agents={agents} setAgents={setAgents} privates={privates} setPrivates={setPrivates} 
      pages={pages} activeId={activeId} onAdd={addPage} onSelect={setActiveId}
      />
      <MainPage pages = {pages} showPage = {showPage} pagetype={pagetype} setPagetype={setPagetype}
      page={activePage} onChange={updatePage} titleInputRef={titleInputRef} pagedataInputRef={pagedataInputRef}/>
>>>>>>> upstream/main
    </div>
  );
}

function App() {
  const [signupLogin, setSignupLogin] = useState("signup");
  return (
    // <MainLayout />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/sideBar" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


// async function submit(updatedPrivates, updatedAgents) {
//   const res = await fetch("http://localhost:8000/users", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       name: name + "_" + Date.now(),
//       privates: updatedPrivates || privates,
//       agents: updatedAgents || agents
//     })
//   });
//   console.log(await res.json());
// }

// useEffect(()=>{
//   async function loadData(){
//     const res=await fetch("http://localhost:8000/users");
//     const data=await res.json();
//     console.log(data)
//     setPrivates(data[data.length-1].privates);
//     setAgents(data[data.length-1].agents);
//   }
// loadData();
// },[]);      //the square bracket is here because it will let the rednder useEffect onece if i provided a nome inside the square bracket then the useEffect work when there is a change in the name