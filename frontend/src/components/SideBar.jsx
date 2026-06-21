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
function SideBar(){
    
    const [width,setWidth]=useState(280);
    const startResize=()=>{
        // onmousedown={startResize}
        const resize=(e)=>{setWidth(e.clientX)};
    
        const stopResize=()=>{
            window.removeEventListener("mousemove",resize)
            window.removeEventListener("mouseup",stopResize)
        };
        window.addEventListener("mousemove",resize)
        window.addEventListener("mouseup",stopResize)
    };
    const [showAgent,setshowAgent]=useState(false);
    const [showPrivate,setshowPrivate]=useState(false);
    return(
        <div className="sidebar" >
            <div className="sidebar-resize" style={{ width: `${width}px` }} onMouseDown={startResize} >
                <label>user name </label>
                <div className="sidebar-options">
                    <button><GoHome className="home-icon"/>Home</button>
                    <button><IoChatbubbleOutline/></button>
                    <button><PiNotepad/></button>
                    <button><RiInbox2Line/></button>
                    <button><IoIosSearch/></button>
                </div>
                <div>
                    <button>
                        Set up your workspace
                    </button>
                </div>
                <div className="agents">
                    <button onClick={()=>setshowAgent(!showAgent)}>Agent</button>
                    {showAgent &&(
                        <div>
                            <button><FaPlus/> New agent</button>
                        </div>

                    )}
                    
                </div>
                <div className="private" >
                    <button onClick={()=>setshowPrivate(!showPrivate)}>Private</button>
                    {showPrivate && (
                        <div>
                            <button><FaBookOpen/>
                                The Notion Basics</button>
                            <button><FaPlus/>
                                Add new</button>
                        </div>
                    )}
                </div>
                <div className="lib-he-tr">
                    <button><LuLibraryBig/>
                        Library
                    </button>
                    <button><RxQuestionMarkCircled/>
                        Help
                    </button>
                    <button><LuTrash2/>
                        Trash
                        
                    </button>
                </div>
            </div>
            
        </div>
    );
}
export default SideBar;