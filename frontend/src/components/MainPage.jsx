import React, { useState } from 'react'
import { BsThreeDots } from "react-icons/bs";
import { FiUpload } from 'react-icons/fi';
import { LuMessageCirclePlus, LuSparkles } from 'react-icons/lu';
import { FaRegFaceKiss } from 'react-icons/fa6';
import { IoIosArrowDown } from "react-icons/io";
import { PiFileAudioFill } from 'react-icons/pi';
import { LuNotepadText } from 'react-icons/lu';
import { FaTableCells } from 'react-icons/fa6';
import { TbTriangleSquareCircleFilled } from 'react-icons/tb';
import { FaRegStar } from 'react-icons/fa6';
import { AiOutlineLink } from 'react-icons/ai';
import { SlLock } from 'react-icons/sl';
import { MdOutlineAddReaction, MdOutlineAddPhotoAlternate } from 'react-icons/md';

function MainPage({Pages,showPage,PageTitle,setPageTitle,showAI,setShowAI}) {
    const showRealPage = Pages.find((x)=>x.id == showPage);
    console.log(showRealPage)
    const [pagename,setPagename]=useState("")
    const [column,setColumn]=useState("Private")
    const [dataEntered,setDataentered]=useState("")
    const [showHoverBar,setShowHoverBar]=useState(false)

    return (
        <div className='mainpage'>
            <div className='main-header'>
                <div className='top-left-btn'>
                    <button className='pagename'><FaRegFaceKiss/><p>{pagename ||  "New Page"}</p></button><p>/</p>
                    <button>{column}</button>
                    <button><IoIosArrowDown/></button>
                </div>
                <div className='top-right-btn'>
                    <button className='share-btn'><SlLock/>Share<IoIosArrowDown/></button>
                    <button><AiOutlineLink/></button>
                    <button><FaRegStar/></button>
                    {/* <button><FiUpload/></button>
                    <button><LuMessageCirclePlus/></button> */}
                    <button><BsThreeDots/></button>
                </div>
            </div>

            <div
                className='title-hover-zone'
                onMouseEnter={()=>setShowHoverBar(true)}
                onMouseLeave={()=>setShowHoverBar(false)}
            >
                <div className={`hover-add-bar ${showHoverBar ? "hover-add-bar-visible" : ""}`}>
                    <button className='hover-add-btn'><MdOutlineAddReaction/>Add icon</button>
                    <button className='hover-add-btn'><MdOutlineAddPhotoAlternate/>Add cover</button>
                    <button className='hover-add-btn'><LuMessageCirclePlus/>Add comment</button>
                </div>

                <div className='main-middle'>
                    <input className='page-title-input' type="text" placeholder="New Page" value={pagename} onChange={(e)=>setPagename(e.target.value)}/>
                    <input className='page-content-input' type="text" placeholder="Press 'space' for AI or '/' for commands" value={dataEntered} onChange={(e)=>setDataentered(e.target.value)}/>
                </div>
            </div>
            
            <div className='bottom-btn'>
                <div className="bottom-getstarted">
                    Get started with
                    <div className='bottom-options'>
                        <button><FaRegFaceKiss/>Ask AI</button>
                        <button><PiFileAudioFill/>AI Meeting Notes </button>
                        <button><FaTableCells/>Database</button>
                        <button><LuNotepadText/>Form</button>
                        <button><TbTriangleSquareCircleFilled/>Templates</button>
                        <button><BsThreeDots/></button>
                    </div>
                </div>
            </div>

            {!showAI && (
                <button className="ai-launcher-btn" onClick={() => setShowAI(true)}>
                    <LuSparkles />
                </button>
            )}

        </div>
    )
}

export default MainPage
// import React, { useState } from 'react'
// import { BsThreeDots } from "react-icons/bs";
// import { FiUpload } from 'react-icons/fi';
// import { LuMessageCirclePlus } from 'react-icons/lu';
// import { FaRegFaceKiss } from 'react-icons/fa6';
// import { IoIosArrowDown } from "react-icons/io";
// import { PiFileAudioFill } from 'react-icons/pi';
// import { LuNotepadText } from 'react-icons/lu';
// import { FaTableCells } from 'react-icons/fa6';
// import { TbTriangleSquareCircleFilled } from 'react-icons/tb';
// import { FaRegStar } from 'react-icons/fa6';
// import { AiOutlineLink } from 'react-icons/ai';
// import { SlLock } from 'react-icons/sl';

// function MainPage({Pages,showPage,PageTitle,setPageTitle}) {
//     const showRealPage = Pages.find((x)=>x.id == showPage);
//     console.log(showRealPage)
//     const [pagename,setPagename]=useState("")
//     const [column,setColumn]=useState("Private")
//     const [dataEntered,setDataentered]=useState("")
//     return (
//         <div className='mainpage'>
//             <div className='main-header'>
//                 <div className='top-left-btn'>
//                     <button className='pagename'><FaRegFaceKiss/><p>{pagename ||  "New Page"}</p></button><p>/</p>
//                     <button>{column}</button>
//                     <button><IoIosArrowDown/></button>
//                 </div>
//                 <div className='top-right-btn'>
//                     <button className='share-btn'><SlLock/>Share<IoIosArrowDown/></button>
//                     <button><AiOutlineLink/></button>
//                     <button><FaRegStar/></button>
//                     {/* <button><FiUpload/></button>
//                     <button><LuMessageCirclePlus/></button> */}
//                     <button><BsThreeDots/></button>
//                 </div>
//             </div>
//             <div className='main-middle'>
//                 <input type="text" placeholder="New Page" value={pagename} onChange={(e)=>setPagename(e.target.value)}/>
//                 <input type="text" placeholder="Press 'space' for AI or '/' for commands" value={dataEntered} onChange={(e)=>setDataentered(e.target.value)}/>
//             </div>
//             <div className='bottom-btn'>
//                 Get started with
//                 <div className='bottom-options'>
//                     <button><FaRegFaceKiss/>Ask AI</button>
//                     <button><PiFileAudioFill/>AI Meeting Notes </button>
//                     <button><FaTableCells/>Database</button>
//                     <button><LuNotepadText/>Form</button>
//                     <button><TbTriangleSquareCircleFilled/>Templates</button>
//                     <button><BsThreeDots/></button>
//                 </div>
//             </div>
        
//         </div>
//     )
// }

// export default MainPage
