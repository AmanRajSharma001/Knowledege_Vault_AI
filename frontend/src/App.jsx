
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import React, { useState, useRef, useEffect, useCallback } from "react";

import SideBar from "./components/SideBar"
import MainPage from './components/MainPage';
import NavBar from "./components/NavBar"
// import Trash from "./components/trash"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp";
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
  // -----------------------merging sidebar aggent and private with mainpage title------------------------



  const [pages, setpages] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const titleInputRef = useRef(null);
  const pagedataInputRef = useRef(null);

  // Focus Chaining: Automatically move focus to the title input in MainPage
  // whenever a new page is added or selected (activeId changes). Since this
  // runs inside useEffect, it executes after the DOM has committed, ensuring
  // the titleInputRef.current is bound and avoids stale-ref timing bugs.
  useEffect(() => {
    if (activeId != null) {
      titleInputRef.current?.focus();
    }
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

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       <Sidebar pages={pages} activeId={activeId} onAdd={addPage} onSelect={setActiveId} />
//       <MainPage
//         page={activePage}
//         onChange={updatePage}
//         titleInputRef={titleInputRef}
//         pagedataInputRef={pagedataInputRef}
//       />
//     </div>
//   );
// }
  // const [currentType,setcurrentType]=useState("Private")
  // const [pageTitle,setpageTitle]=useState("")
  // const [page_Data,setpageData]=useState("")
  // const [pagess,setpagess]=useState([])
  // const [focusTitle,setfocusTitle]=useState(false)


  
  const [Pages,setPages] = useState(pageData);
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden',backgroundColor: '#fff'}}>
      <SideBar Pages = {Pages} setPages = { setPages } showPage = {showPage} setShowPage = {setShowPage}
       agents={agents} setAgents={setAgents} privates={privates} setPrivates={setPrivates} 
      submit = {submit} 
      // currentType={currentType} setcurrentType={setcurrentType} focusTitle={focusTitle} setfocusTitle={setfocusTitle} 
      pages={pages} activeId={activeId} onAdd={addPage} onSelect={setActiveId}
      />
      <MainPage Pages = {Pages} showPage = {showPage} 
      // currentType={currentType} pageTitle={pageTitle} setpageTitle={setpageTitle} page_Data={page_Data} setpageData={setpageData}
      //  pagess={pagess} setpagess={setpagess} focusTitle={focusTitle} setfocusTitle={setfocusTitle} 
      page={activePage} onChange={updatePage} titleInputRef={titleInputRef} pagedataInputRef={pagedataInputRef}/>

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

