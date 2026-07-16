import React, { useState, useEffect, useRef } from 'react';
import { RxDoubleArrowRight } from "react-icons/rx";
import { BsSend } from "react-icons/bs";
import { PiNotepad } from "react-icons/pi";
import { ImAttachment } from 'react-icons/im';
import { IoChatbubbleOutline } from "react-icons/io5";
import { LuLibraryBig, LuSparkles, LuLanguages, LuPresentation, LuChartLine } from "react-icons/lu";


import { UPLOAD_RAG_PDF } from "../api/auth";
import { ask_question } from "../api/auth"
// ==================================
// AI Message + Response Function
// ==================================
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [llmResponse,setLlmResposne] = useState("")
    const ASKQuery=async()=>{
        try {
            const response = await ask_question(query)
            setLlmResposne(response)
            let chatVal = {"user":query,"Llm":response}
            setMessages(prev => [...prev, chatVal])
            } catch (err) {
            console.error(err);
            const errMsg = {
                id: Date.now() + 1,
                sender: "assistant",
                text: "The AI service is currently unavailable. Please try again later.",
            };
            setMessages(prev => [...prev, errMsg]);
            } finally {
            setIsTyping(false);
            setIsSending(false);
            }
        }


function AiPanel({ onClose }) {

    const [animate, setAnimate] = useState(false);
    const [chats,setchats]=useState([])

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimate(true);
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setAnimate(false);
        setTimeout(onClose, 300);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setInputValue("");
        }
    };
    // opening file explorer to input the file
    const fileinputRef=useRef(null)
    const [pdfUrl, setPdfUrl] = useState(null);
    const openFileExplorer=()=>{
        fileinputRef.current.click()
    }
    const handlefilechange=(event)=>{
        const selectedFile=event.target.files[0]
        if(selectedFile){
            setFile(selectedFile)
            setPdfUrl(URL.createObjectURL(selectedFile))
        }
    }
    // uploading pdf to supabase its temperary and further can be chanjed in just calling the function
    const [message, setMessage] = useState("");
    const [isUploaded, setIsUploaded] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [file, setFile] = useState(null);
    const handleUploadPDF = async () => {
        if (!file) {
          alert("Please select a PDF first.");
          return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
        setMessage("Uploading…");
    
        try{
            const data = await UPLOAD_RAG_PDF(formData)
    
            
            setMessage(data.message || "Uploaded successfully");
            setIsUploaded(true);
            setUploadedFileName(file.name);
        
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
    };
    

    return (
        <div className={`aiPanel ${animate ? 'open' : ''}`}>
            <div className="aiTop">
                <h3>New AI chat</h3>
                <button className="aiClose" onClick={handleClose}>
                    <RxDoubleArrowRight />
                </button>
            </div>
            
            <div className="aiMain">
                <div className="aiEmpty">
                    <div className="aiSparkle">
                        <LuSparkles className="aiIcon" />
                    </div>
                    <h2 className="aiTitle">How can I help you today?</h2>
                    
                    <div className="aiOptions">
                        <button className="aiOption">
                            <PiNotepad className="aiIcon" />
                            <span>Summarize this page</span>
                        </button>
                        <button className="aiOption">
                            <LuPresentation className="aiIcon" />
                            <span>Create a slide deck</span>
                        </button>
                        <button className="aiOption">
                            <LuLanguages className="aiIcon" />
                            <span>Translate this page</span>
                        </button>
                        <button className="aiOption">
                            <LuChartLine className="aiIcon" />
                            <span>Analyze for insights</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="aiBottom">
                <form onSubmit={handleSend}>        
                            {pdfUrl&&(
                                <div className="pdfName">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                                    <path fill="#F5F5F5" d="M16 4h24l16 16v36a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"/>
                                    <path fill="#E53935" d="M40 4v16h16"/>
                                    <rect x="10" y="38" width="44" height="16" rx="4" fill="#D32F2F"/>
                                    <text x="32" y="50" text-anchor="middle" font-size="10" font-family="Arial" fill="white" font-weight="bold">PDF</text>
                                    </svg>

                                    <p>{file?.name}</p>
                                </div>
                                
                            )}
                    <div className="aiInput">
                        <textarea 
                            className="aiTextarea" 
                            placeholder="Do anything with AI..." 
                            value={inputValue} 
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                        />
                        <div className="aiControls">
                            <button className="attachment-icon" onClick={(openFileExplorer)}><ImAttachment/></button>
                            <input type="file" ref={fileinputRef} accept="application/pdf" onChange={()=>handlefilechange} style={{display:'none'}} />
                            <span className="aiModel">Knowledge Assistant</span>
                            <button type="submit" className="aiSend" onClick={()=>{
                                handleUploadPDF();ASKQuery();
                            }}>
                                <BsSend />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AiPanel;
