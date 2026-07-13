import React, { useState, useEffect } from 'react';
import { RxDoubleArrowRight } from "react-icons/rx";
import { BsSend } from "react-icons/bs";
import { PiNotepad } from "react-icons/pi";
import { IoChatbubbleOutline } from "react-icons/io5";
import { LuLibraryBig, LuSparkles, LuLanguages, LuPresentation, LuChartLine } from "react-icons/lu";

function AiPanel({ onClose }) {
    const [animate, setAnimate] = useState(false);
    const [inputValue, setInputValue] = useState("");

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
                    <div className="aiInput">
                        <textarea 
                            className="aiTextarea" 
                            placeholder="Do anything with AI..." 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                        />
                        <div className="aiControls">
                            <span className="aiModel">Knowledge Assistant</span>
                            <button type="submit" className="aiSend" disabled={!inputValue.trim()}>
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
