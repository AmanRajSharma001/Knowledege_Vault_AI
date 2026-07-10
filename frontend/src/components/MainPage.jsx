import React, { useState,useRef,useEffect } from 'react'
import { BsThreeDots } from "react-icons/bs";
import { FiUpload } from 'react-icons/fi';
import { LuMessageCirclePlus } from 'react-icons/lu';
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
import { FaFileUpload } from 'react-icons/fa';
import { page_data_title } from "../api/auth";

function MainPage({Pages,showPage,currentType,pageTitle,setpageTitle,page_Data,setpageData,pagess,setpagess,focusTitle,setfocusTitle,
    page, onChange, titleInputRef, pagedataInputRef}) {
    const showRealPage = Pages.find((x)=>x.id == showPage);
    console.log(showRealPage)
    const [showHoverBar,setShowHoverBar]=useState(false)
    // ---------------------------------------------------
    const titleRef=useRef(null)
    const dataRef=useRef(null)
    useEffect(()=>{
        console.log("focusTitle changed:", focusTitle);
        if(focusTitle){
            const refToFocus = titleInputRef || titleRef;
            refToFocus.current?.focus();
            if (setfocusTitle) setfocusTitle(false);
        }
    },[focusTitle, titleInputRef, setfocusTitle]);
    function createpage(){
        const newPage={
            id:Date.now(),
            type:currentType,
            title:pageTitle,
            data:page_Data
        }
        setpagess([...pagess,newPage])
    }
    // ---------------------------------------------------
    const [column,setColumn]=useState("Private")
    const [pagename,setPagename]=useState("")
    const [dataEntered,setDataentered]=useState("")
    const [user_id,setUser_id]=useState(1)
    const [page_id,setPage_id]=useState(3)
    const [pagetype,setPagetype]=useState("private")
    const [parent_page_id,setParentPageId]=useState(null)
    const secondInputRef=useRef(null)
    const datastored=async()=>{
        // userid we will get from local storage
        try{
            const titleToSend = page ? page.title : pagename;
            const dataToSend = page ? page.pagedata : dataEntered;
            const result=await page_data_title({page_id,title: titleToSend,page_type: pagetype,page_data: dataToSend,parent_page_id}) 
            console.log(result)
        }
        catch(error){
            console.log("Full error:", error);
            console.log("Response:", error.response);
            console.log("Status:", error.response?.status);
            console.log("Data:", error.response?.data);
            if (error.response?.data?.detail) {
                console.log("Validation details:", error.response.data.detail);
            }
        }
    }

    return (
        <div className='mainpage'>
            <div className='main-header'>
                <div className='top-left-btn'>
                    <button className='pagename'><FaRegFaceKiss/><p>{(page ? page.title : pagename) ||  "New Page"}</p></button><p>/</p>
                    <button>{column}</button>
                    <button><IoIosArrowDown/></button>
                </div>
                <div className='top-right-btn'>
                    <button className='share-btn'><SlLock/>Share<IoIosArrowDown/></button>
                    <button  onClick={()=>datastored()}><FaFileUpload/></button>
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
                    {/* <input className='page-title-input'  type="text" placeholder="New Page" value={pagename} onChange={(e)=>setPagename(e.target.value)} onKeyDown={(e)=>{
                        if (e.key==="Enter"){
                            secondInputRef.current.focus();
                        }
                    }}/> */}
                    <input
                        className='page-title-input'
                        ref={titleInputRef || titleRef}
                        type="text"
                        placeholder="New Page"
                        value={page ? page.title : pageTitle}
                        onChange={(e) => {
                            if (page) {
                                onChange(page.id, "title", e.target.value);
                            } else {
                                setPagename(e.target.value);
                                if (setpageTitle) setpageTitle(e.target.value);
                            }
                        }}
                        onKeyDown={(e) => {
                            // Focus Chaining: When pressing Enter in the title input,
                            // immediately transfer focus to the pagedata input.
                            if (e.key === "Enter") {
                                const nextRef = pagedataInputRef || dataRef;
                                nextRef.current?.focus();
                            }
                        }}
                    />
                    {/* <input className='page-content-input' ref={secondInputRef} type="text" placeholder="Press 'space' for AI or '/' for commands" value={dataEntered} onChange={(e)=>setDataentered(e.target.value)}/> */}
                    <input
                        className='page-content-input'
                        ref={pagedataInputRef || dataRef}
                        type="text"
                        placeholder="Press 'space' for AI or '/' for commands"
                        value={page ? page.pagedata : dataEntered}
                        onChange={(e) => {
                            if (page) {
                                onChange(page.id, "pagedata", e.target.value);
                            } else {
                                setDataentered(e.target.value);
                                if (setpageData) setpageData(e.target.value);
                            }
                        }}
                    />
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
