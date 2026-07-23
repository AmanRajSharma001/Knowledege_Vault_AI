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

// ====================================INLINE EDITABLE ITEM=========================================

function EditableSidebarItem({ placeholder, onSave, onCancel }) {
    const [value, setValue] = useState("");
    const isCommittedRef = useRef(false);

    const handleSave = () => {
        if (isCommittedRef.current) return;
        isCommittedRef.current = true;
        const trimmed = value.trim();
        if (trimmed) {
            onSave(trimmed);
        } else {
            onCancel();
        }
    };

    const handleCancel = () => {
        if (isCommittedRef.current) return;
        isCommittedRef.current = true;
        onCancel();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape") {
            e.preventDefault();
            handleCancel();
        }
    };

    return (
        <div style={{ padding: "2px 0" }}>
            <input
                autoFocus
                className="sb-inline-input"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
            />
        </div>
    );
}

// ====================================SIDEBAR ITEM=========================================

function SidebarItem({ item, icon: Icon, isActive, onSelect, isNested = false }) {
    const title = typeof item === "string" ? item : item.title || "Untitled";
    const itemId = typeof item === "string" ? item : item.id;

    if (isNested) {
        return (
            <div className={`sb-page-row ${isActive ? "sb-page-row--active" : ""}`} onClick={() => onSelect(itemId, item)}>
                <button className={`sb-nav-item sb-page-item sb-page-item--nested ${isActive ? "sb-nav-item--active" : ""}`}>
                    <IoIosArrowForward className="sb-nav-icon sb-chevron-icon" />
                    <span className="sb-nav-label">{title}</span>
                </button>
                <div className="sb-page-row-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="sb-icon-btn" title="Options"><BsThreeDots /></button>
                    <button className="sb-icon-btn" title="New sub-page"><FaPlus /></button>
                </div>
            </div>
        );
    }

    return (
        <button
            className={`sb-nav-item sb-page-item ${isActive ? "sb-nav-item--active" : ""}`}
            onClick={() => onSelect(itemId, item)}
        >
            {Icon && <Icon className="sb-nav-icon" />}
            <span className="sb-nav-label">{title}</span>
        </button>
    );
}

// ====================================SIDEBAR RESIZE BAR=========================================

function SideBar({
    Pages, setPages, showPage, setShowPage,
    agents: propAgents, setAgents: propSetAgents,
    privates: propPrivates, setPrivates: propSetPrivates,
    pagename, setPagename, setPagetype, setfocusTitle,
    pages, activeId, onAdd, onSelect
}) {
    const [filterPages, setFilterPages] = useState(Pages); //later work

    // Local fallback state if props are not provided
    const [internalAgents, setInternalAgents] = useState([
        { id: "agent-1", title: "Agent A" },
        { id: "agent-2", title: "Agent B" }
    ]);
    const agents = (propAgents && propAgents.length > 0) ? propAgents : internalAgents;
    const setAgents = (newAgents) => {
        setInternalAgents(newAgents);
        if (propSetAgents) propSetAgents(newAgents);
    };

    const [internalPrivates, setInternalPrivates] = useState([
        { id: "private-1", title: "Page 1" },
        { id: "private-2", title: "Page 2" }
    ]);
    const privates = (propPrivates && propPrivates.length > 0) ? propPrivates : internalPrivates;
    const setPrivates = (newPrivates) => {
        setInternalPrivates(newPrivates);
        if (propSetPrivates) propSetPrivates(newPrivates);
    };

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

    // const [showInput, setshowInput] = useState(false);
    const [agentName, setagentName] = useState("");
    const addAgent = () => {
        if (agentName.trim() !== "") {
            const newAgents = [...agents, agentName];
            // const newAgents = [...agents, pagename];
            console.log("Agent clicked");

            setAgents(newAgents);
            if (setPagetype) setPagetype("Agents");
            if (setfocusTitle) setfocusTitle(true);
            setagentName("");
            // setshowInput(false);
            // submit(privates, newAgents);
        }
    };
    const [showArrow, setshowArrow] = useState(false);

    const [showPrivateInput, setshowPrivateInput] = useState(false);
    const [privateName, setprivateName] = useState("");

    // =======================PRIVATE=====================================
    const addPrivate = () => {
        if (privateName.trim() !== "") {
            const newPrivates = [...privates, privateName];
            // setPagetype("Privates")
            if (setfocusTitle) setfocusTitle(true);
            setPrivates(newPrivates);
            setprivateName("");
            setshowPrivateInput(false);
            // submit(agents,newPrivates);
        }
    };

    // Independent state for AGENTS section
    const [showAgent, setshowAgent] = useState(true);
    const [isCreatingAgent, setIsCreatingAgent] = useState(false);
    const [selectedAgentId, setSelectedAgentId] = useState(null);

    // Independent state for PRIVATE section
    const [showPrivate, setshowPrivate] = useState(true);
    const [isCreatingPrivate, setIsCreatingPrivate] = useState(false);
    const [selectedPrivateId, setSelectedPrivateId] = useState(null);

    // Agent Creation Logic
    const handleSaveAgent = (name) => {
        const newAgent = { id: `agent-${Date.now()}`, title: name, pagedata: "" };
        const updated = [...agents, newAgent];
        setAgents(updated);
        setIsCreatingAgent(false);
        setSelectedAgentId(newAgent.id);
        if (setPagetype) setPagetype("Agent");
        if (setfocusTitle) setfocusTitle(true);
        if (onSelect) onSelect(newAgent.id);
        if (setShowPage) setShowPage(newAgent.id);
    };

    const handleCancelAgent = () => {
        setIsCreatingAgent(false);
    };

    // Private Page Creation Logic
    const handleSavePrivate = (title) => {
        const newPrivate = { id: `private-${Date.now()}`, title: title, pagedata: "" };
        const updated = [...privates, newPrivate];
        setPrivates(updated);
        setIsCreatingPrivate(false);
        setSelectedPrivateId(newPrivate.id);
        if (setPagetype) setPagetype("Private");
        if (setfocusTitle) setfocusTitle(true);
        if (onSelect) onSelect(newPrivate.id);
        if (setShowPage) setShowPage(newPrivate.id);
    };

    const handleCancelPrivate = () => {
        setIsCreatingPrivate(false);
    };

    // Selection Handlers
    const handleSelectAgent = (id, item) => {
        setSelectedAgentId(id);
        if (setPagetype) setPagetype("Agent");
        if (onSelect) onSelect(id);
        if (setShowPage) setShowPage(id);
    };

    const handleSelectPrivate = (id, item) => {
        setSelectedPrivateId(id);
        if (setPagetype) setPagetype("Private");
        if (onSelect) onSelect(id);
        if (setShowPage) setShowPage(id);
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
                            <div className="sb-section-actions" onClick={(e) => e.stopPropagation()}>
                                <button className="sb-icon-btn" title="Options">
                                    <BsThreeDots />
                                </button>
                                {/* <button className="sb-icon-btn" onClick={(e) => { e.stopPropagation(); onAdd(); setshowAgent(true); }} title="New agent" >
                                    <FaPlus />
                                </button> */}
                                <button
                                    className="sb-icon-btn"
                                    onClick={() => {
                                        setIsCreatingAgent(true);
                                        setshowAgent(true);
                                    }}
                                    title="New agent"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>

                        {showAgent && (
                            <div className="sb-section-body">
                                <button
                                    className="sb-nav-item sb-add-item"
                                    onClick={() => {
                                        setIsCreatingAgent(true);
                                        setshowAgent(true);
                                    }}
                                >
                                    <FaPlus className="sb-nav-icon sb-add-icon" />
                                    <span className="sb-nav-label" onClick={() => setPagetype && setPagetype("Agent")}>New agent</span>
                                </button>

                                {/* {showInput && (
                                    <input className="sb-inline-input" type="text" placeholder="Agent name…" value={agentName} onChange={(e) => setagentName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ;addAgent(); }}/>
                                    // <input className="sb-inline-input" type="text" placeholder="Agent name…" value={pagename} onChange={(e) => setPagename(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addAgent(); autoFocus}}/>
                                )} */}

                                {isCreatingAgent && (
                                    <EditableSidebarItem
                                        placeholder="Agent name…"
                                        onSave={handleSaveAgent}
                                        onCancel={handleCancelAgent}
                                    />
                                )}

                                {agents.map((agent, index) => {
                                    const itemObj = typeof agent === "string" ? { id: `agent-${index}`, title: agent } : agent;
                                    const itemId = itemObj.id || `agent-${index}`;
                                    const isActive = itemId === selectedAgentId || itemId === activeId;
                                    return (
                                        <SidebarItem
                                            key={itemId}
                                            item={itemObj}
                                            icon={IoChatbubbleOutline}
                                            isActive={isActive}
                                            onSelect={handleSelectAgent}
                                        />
                                    );
                                })}
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
                            <div className="sb-section-actions" onClick={(e) => e.stopPropagation()}>
                                <button className="sb-icon-btn" title="Templates">
                                    <LuLibraryBig />
                                </button>
                                <button className="sb-icon-btn" title="Options">
                                    <BsThreeDots />
                                </button>
                                <button
                                    className="sb-icon-btn"
                                    onClick={() => {
                                        setIsCreatingPrivate(true);
                                        setshowPrivate(true);
                                    }}
                                    title="New page"
                                >
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
                                <button
                                    className="sb-nav-item sb-add-item"
                                    onClick={() => {
                                        setIsCreatingPrivate(true);
                                        setshowPrivate(true);
                                    }}
                                >
                                    {/* <button className="sb-nav-item sb-add-item" onClick={() => {onAdd(); setshowPrivateInput(true)}} > */}
                                    <FaPlus className="sb-nav-icon sb-add-icon" />
                                    <span className="sb-nav-label">Add new</span>
                                </button>

                                {/* {showPrivateInput && (
                                    <input className="sb-inline-input" type="text" placeholder="Page title…" value={privateName} onChange={(e) => setprivateName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addPrivate(); }} autoFocus/>
                                    // <button className="sb-inline-input" type="text" placeholder="Page title…" value={privateName} onChange={(e) => setprivateName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addPrivate(); }} autoFocus/>
                                )} */}

                                {isCreatingPrivate && (
                                    <EditableSidebarItem
                                        placeholder="Page title…"
                                        onSave={handleSavePrivate}
                                        onCancel={handleCancelPrivate}
                                    />
                                )}

                                {privates.map((item, index) => {
                                    const itemObj = typeof item === "string" ? { id: `private-${index}`, title: item } : item;
                                    const itemId = itemObj.id || `private-${index}`;
                                    const isActive = itemId === selectedPrivateId || itemId === activeId;
                                    return (
                                        <SidebarItem
                                            key={itemId}
                                            item={itemObj}
                                            isNested={true}
                                            isActive={isActive}
                                            onSelect={handleSelectPrivate}
                                        />
                                    );
                                })}
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

            <div className={`sidebar-dragger${isResizing ? " resizing" : ""}`} onMouseDown={startResize} />
        </div>
    );
}

export default SideBar;