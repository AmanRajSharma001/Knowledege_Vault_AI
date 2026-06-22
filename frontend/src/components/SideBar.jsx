import {useState,useRef,useEffect} from "react"
import { GoHome } from "react-icons/go";  //home
import { IoChatbubbleOutline } from "react-icons/io5";  //chat
import { RiInbox2Line } from "react-icons/ri";  //mailbox
import { IoIosSearch } from "react-icons/io";  //search
import { PiNotepad } from "react-icons/pi"; //notepad
import { FaPlus } from "react-icons/fa6";  //plus
import { LuLibraryBig } from "react-icons/lu";  //library
import { RxQuestionMarkCircled } from "react-icons/rx";  //question
import { LuTrash2 } from "react-icons/lu";   //trash
import { FaBookOpen } from "react-icons/fa6";  //book
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa6";
function SideBar(){
    const [userName,setuserName]=useState("Virat")
//===================movable window==================================== 
    const [width,setWidth]=useState(280);
    const startResize=()=>{
        const resize=(e)=>{setWidth(e.clientX)};
    
        const stopResize=()=>{
            window.removeEventListener("mousemove",resize)
            window.removeEventListener("mouseup",stopResize)
        };
        window.addEventListener("mousemove",resize)
        window.addEventListener("mouseup",stopResize)
    };
//======================agent dropdown======================================

    const [showAgent,setshowAgent]=useState(false);
    const [showInput,setshowInput]=useState(false);
    const [agentName,setagentName]=useState("");
    const [agents,setAgents]=useState([]);
    const addAgent=()=>{
        if (agentName.trim()!==""){
            setAgents([...agents,agentName]);
            setagentName("");
            setshowInput(false);
        }
    }
//=========================Private Dropdown==========================================
    const [showPrivate,setshowPrivate]=useState(false);
    const [showPrivateInput,setshowPrivateInput]=useState(false);
    const [privateName,setprivateName]=useState("");
    const [privates,setPrivates]=useState([]);
    const addPrivate=()=>{
        if(privateName.trim()!==""){
            setPrivates([...privates,privateName]);
            setprivateName("");
            setshowPrivateInput(false);
        }
    }
    return(
        <div className="sidebar" >
            {/* ======================Movable section================================= */}
            <div className="sidebar-resize"  onMouseDown={startResize} style={{ width: `${width}px` }} >
                
                <label>{userName}<FaUserTie className="user-icon"/></label>
                <div className="sidebar-options">
                    <button><GoHome className="home-icon"/>Home</button>
                    <button><IoChatbubbleOutline/></button>
                    <button><PiNotepad/></button>
                    <button><RiInbox2Line/></button>
                    <button><IoIosSearch/></button>
                </div>
                <div className="workspace">
                    <button>
                        Set up your workspace
                        
                    </button>
                </div>
                {/* ========================Agents section=========================== */}
                <div className="agents">
                    <div className="agents-header">
                        {showAgent ? (
                            <IoIosArrowDown
                                onClick={() => setshowAgent(false)}
                            />
                        ) : (
                            <IoIosArrowForward
                                onClick={() => setshowAgent(true)}
                            />
                        )}
                        <button onClick={() => setshowAgent(!showAgent)}>
                            Agent
                        </button>

                        <button className="three-dot-options">
                            <BsThreeDots />
                        </button>
                    </div>
                    {showAgent && (
                        <div className="agent-options">
                            <button onClick={() => setshowInput(!showInput)}>
                                <FaPlus />
                                New agent
                            </button>
                            {showInput && (
                                <input
                                    type="text"
                                    placeholder="Enter"
                                    value={agentName}
                                    onChange={(e) => setagentName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            addAgent();
                                        }
                                    }}
                                    autoFocus
                                />
                            )}
                            {agents.map((agent, index) => (
                                <button key={index}>
                                    {agent}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {/* ======================Private Section========================*/}
                <div className="private" >
                    <div className="private-headers">
                        {showPrivate?(
                            <IoIosArrowDown onClick={()=>setshowPrivate(false)}/>

                        ):(
                            <IoIosArrowForward onClick={()=>setshowPrivate(true)}/>
                        )}
                        <button onClick={()=>setshowPrivate(!showPrivate)}>Private</button>
                        <button className="three-dot-options"><BsThreeDots/></button>
                    </div>
                    {showPrivate && (
                        <div className="private-options">
                            <button><FaBookOpen/>
                                The Notion Basics</button>
                            <button onClick={()=>setshowPrivateInput(!showPrivateInput)}><FaPlus/>
                                Add new</button>
                                {showPrivateInput && (
                                    <input 
                                    type="text"
                                    placeholder="Enter "
                                    value={privateName}
                                    onChange={(e)=>setprivateName(e.target.value)}
                                    onKeyDown={(e)=>{
                                        if(e.key=="Enter"){
                                            addPrivate()
                                        }
                                    }}
                                    autoFocus
                                    />
                                )}
                                {privates.map((privatee,index)=>(
                                    <button key={index}>{privatee}</button>
                                ))}
                        </div>
                    )}
                </div>
                <div className="lib-help-trash">
                    <button className="lib"><LuLibraryBig/>Library
                    </button>
                    <button className="help"><RxQuestionMarkCircled/>
                        Help
                    </button>
                    <button className="trash"><LuTrash2/>
                        Trash   
                    </button>
                </div>
            </div>
            
        </div>
    );
}
export default SideBar;