import { useState, useEffect, useRef, useCallback } from "react";
import { GoHome } from "react-icons/go";
import { IoChatbubbleOutline } from "react-icons/io5";
import { RiInbox2Line } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { PiNotepad } from "react-icons/pi";
import { FaPlus } from "react-icons/fa6";
import { LuLibraryBig } from "react-icons/lu";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { LuTrash2 } from "react-icons/lu";
import { FaBookOpen } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa6";
import { BsPencilSquare } from "react-icons/bs";
import { RxDoubleArrowLeft } from "react-icons/rx";

// ====================================SIDEBAR RESIZE BAR=========================================

function SideBar({Pages,setPages,showPage,setShowPage,PageTitle,setPageTitle,agents,setAgents,privates,setPrivates,submit}) {
    const [filterPages,setFilterPages] = useState(Pages); //later work
    const [userName, setuserName] = useState("Virat");
    const [width, setWidth] = useState(270);
    const [isResizing, setIsResizing] = useState(false);
    const dragInfo = useRef({ startX: 0, startWidth: 0 });
    const startResize = useCallback((e) => {
        e.preventDefault();
        setIsResizing(true);
        dragInfo.current = {
            startX: e.clientX,
            startWidth: width,
        };
    }, [width]);

    useEffect(() => {
        if (!isResizing) return;

        // =======================TAKING MOUSE WIDTH========================

        const handleMouseMove = (e) => {
            const deltaX = e.clientX - dragInfo.current.startX;
            const newWidth = dragInfo.current.startWidth + deltaX;
            setWidth(Math.max(220, Math.min(480, newWidth)));
        };
        // =====================WHEN BUTTON IS RELEASED
        const handleMouseUp = () => {
            setIsResizing(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    // ==============================AGENTS===================================

    const [showoptions, setShowOptions] = useState("Home");

    const [showAgent, setshowAgent] = useState(false);
    const [showInput, setshowInput] = useState(false);
    const [agentName, setagentName] = useState("");
    const addAgent = () => {
        if (agentName.trim() !== "") {
            const newAgents = [...agents, agentName];
            setAgents(newAgents);
            setagentName("");
            setshowInput(false);
            submit(privates, newAgents);
        }
    };
    const [showArrow, setshowArrow] = useState(false);

    const [showPrivate, setshowPrivate] = useState(false);
    const [showPrivateInput, setshowPrivateInput] = useState(false);
    const [privateName, setprivateName] = useState("");

    // =======================PRIVATE=====================================
    const addPrivate = () => {
        if (privateName.trim() !== "") {
            const data = [...Pages]
            setPages([
                {
                    id: Date.now(),
                    title: privateName,
                    icon: "📘",
                    createdBy: "user_1",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastEditedBy: "Virat",
                    visibility: "private",
                    tags: ["Getting Started"],
                    aiEnabled: true,
                    children: []
                },...data
            ])
            const newPrivates = [...privates, privateName];
            setPrivates(newPrivates);
            setprivateName("");
            setshowPrivateInput(false);
            submit(newPrivates, agents);
        }
    };

    return (
        // ============================SIDEBAR RESIZE================================
        <div className="sidebar" style={{ width: `${width}px` }}>
            <div className="sidebar-inner">

                <div className="sb-top">
                    <div className="sb-workspace">
                        <div className="sb-workspace-left">
                            <div className="sb-workspace-avatar">
                                <FaUserTie className="sb-avatar-icon" />
                            </div>
                            {/* ==============WORKSPACE HEADNIG================ */}
                            <span className="sb-workspace-name">{`${userName}'s Space`}</span>
                            <span><IoIosArrowDown className="sb-arrow-icon" /> </span>
                        </div>
                            {/*===========BUTTON FINCTION FRO CLOSING SIDE BAR============== */}
                        <div className="sb-workspace-actions">
                            <button className="sb-icon-btn sb-collapse-btn" title="Close sidebar">
                                <RxDoubleArrowLeft />
                            </button>
                        </div>
                    </div>
                    {/* =======================================SIDEBAR OPTIONS======================================== */}
                    <nav className="sb-nav">
                        <button className={`sb-nav-item${showoptions === "Home" ? " sb-nav-item--active" : ""}`} onClick={() => setShowOptions("Home")}>
                            <GoHome className="sb-nav-icon" />
                            <span className="sb-nav-label">Home</span>
                        </button>
                        <button className={`sb-nav-item${showoptions === "Search" ? " sb-nav-item--active" : ""}`} onClick={() => setShowOptions("Search")}>
                            <IoIosSearch className="sb-nav-icon" />
                            <span className="sb-nav-label">Search</span>
                        </button>

                        <button className={`sb-nav-item${showoptions === "Chat" ? " sb-nav-item--active" : ""}`} onClick={() => setShowOptions("Chat")}>
                            <IoChatbubbleOutline className="sb-nav-icon" />
                            <span className="sb-nav-label">Chat</span>
                        </button>

                        <button className={`sb-nav-item${showoptions === "Meetings" ? " sb-nav-item--active" : ""}`} onClick={() => setShowOptions("Meetings")}>
                            <PiNotepad className="sb-nav-icon" />
                            <span className="sb-nav-label">Meetings</span>
                        </button>

                        <button className={`sb-nav-item${showoptions === "Inbox" ? " sb-nav-item--active" : ""}`} onClick={() => setShowOptions("Inbox")}>
                            <RiInbox2Line className="sb-nav-icon" />
                            <span className="sb-nav-label">Inbox</span>
                        </button>
                    </nav>
                </div>

                <div className="sb-middle">
                    {/* =======================================AGENTS===================================================== */}
                    <div className="sb-section">
                        <div className={`sb-section-header${showAgent ? " sb-section-header--open" : ""}`} onClick={() => setshowAgent(!showAgent)}>
                            <button className="sb-section-arrow">
                                {showAgent ? <IoIosArrowDown className="sb-arrow-icon" /> : <IoIosArrowForward className="sb-arrow-icon" />}
                            </button>
                            <span className="sb-section-title">Agents</span>
                            <div className="sb-section-actions">
                                <button className="sb-icon-btn" onClick={(e) => { e.stopPropagation(); }} title="Options">
                                    <BsThreeDots />
                                </button>
                                <button className="sb-icon-btn" onClick={(e) => { e.stopPropagation(); setshowInput(!showInput); setshowAgent(true); }} title="New agent" >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                        {showAgent && (
                            <div className="sb-section-body">
                                <button className="sb-nav-item sb-add-item" onClick={() => setshowInput(!showInput)} >
                                    <FaPlus className="sb-nav-icon sb-add-icon" />
                                    <span className="sb-nav-label">New agent</span>
                                </button>
                                {showInput && (
                                    <input className="sb-inline-input" type="text" placeholder="Agent name…" value={agentName} onChange={(e) => setagentName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addAgent(); }}/>
                                )}
                                {agents.map((agent, index) => (
                                    <button key={index} className="sb-nav-item sb-page-item">
                                        <IoChatbubbleOutline className="sb-nav-icon" />
                                        <span className="sb-nav-label">{agent}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                        {/* ==========================================PRIVATE========================================================== */}
                    <div className="sb-section">
                        <div className={`sb-section-header${showPrivate ? " sb-section-header--open" : ""}`} onClick={() => setshowPrivate(!showPrivate)}>
                            <button className="sb-section-arrow">
                                {showPrivate ? <IoIosArrowDown className="sb-arrow-icon" /> : <IoIosArrowForward className="sb-arrow-icon" />}
                            </button>
                            <span className="sb-section-title">Private</span>
                            <div className="sb-section-actions">
                                <button className="sb-icon-btn" onClick={(e) => e.stopPropagation()}title="Templates">
                                    <LuLibraryBig />
                                </button>
                                <button className="sb-icon-btn" onClick={(e) => e.stopPropagation()} title="Options">
                                    <BsThreeDots />
                                </button>
                                <button className="sb-icon-btn" onClick={(e) => { e.stopPropagation(); setshowPrivateInput(!showPrivateInput); setshowPrivate(true); }} title="New page">
                                    <FaPlus />
                                </button>
                            </div>
                        </div>

                        {showPrivate && (
                            <div className="sb-section-body">
                                <button className="sb-nav-item sb-page-item">
                                    <FaBookOpen className="sb-nav-icon" />
                                    <span className="sb-nav-label">The Notion Basics</span>
                                </button>
                                <button className="sb-nav-item sb-add-item" onClick={() => setshowPrivateInput(!showPrivateInput)} >
                                    <FaPlus className="sb-nav-icon sb-add-icon" />
                                    <span className="sb-nav-label">Add new</span>
                                </button>
                                {showPrivateInput && (
                                    <input className="sb-inline-input" type="text" placeholder="Page title…" value={privateName} onChange={(e) => setprivateName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addPrivate(); }} autoFocus/>
                                )}
                                {Pages.map((page,index) => (
                                    <div key={index} className="sb-page-row" onClick={()=>setShowPage(page.id)}>
                                        <button className="sb-nav-item sb-page-item sb-page-item--nested">
                                            <IoIosArrowForward className="sb-nav-icon sb-chevron-icon" />
                                            <span className="sb-nav-label">{page.title}</span>
                                        </button>
                                        <div className="sb-page-row-actions">
                                            <button className="sb-icon-btn" title="Options"><BsThreeDots /></button>
                                            <button className="sb-icon-btn" title="New sub-page"><FaPlus /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ===================================SIDEBAR BOTTOM================================== */}
                <div className="sb-bottom">
                    <button className="sb-nav-item">
                        <LuLibraryBig className="sb-nav-icon" />
                        <span className="sb-nav-label">Library</span>
                    </button>
                    <button className="sb-nav-item">
                        <RxQuestionMarkCircled className="sb-nav-icon" />
                        <span className="sb-nav-label">Help</span>
                    </button>
                    <button className="sb-nav-item">
                        <LuTrash2 className="sb-nav-icon" />
                        <span className="sb-nav-label">Trash</span>
                    </button>
                </div>
                    
                        {/* =====================================SIDEBAR NEW CHAT=============================== */}
                <div className="sb-footer">
                    <button className="sb-new-chat-btn">
                        <span className="sb-new-chat-label">New Chat</span>
                    </button>
                    <button className="sb-icon-btn sb-pencil-btn" title="New note">
                        <BsPencilSquare />
                    </button>
                </div>
            </div>

            <div className={`sidebar-dragger${isResizing ? " resizing" : ""}`} onMouseDown={startResize}/>
        </div>
    );
}

export default SideBar;