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
        <div className={`ai-panel ${animate ? 'open' : ''}`}>
            <div className="ai-header">
                <h3>New AI chat</h3>
                <button className="ai-close-btn" onClick={handleClose}>
                    <RxDoubleArrowRight />
                </button>
            </div>
            
            <div className="ai-content">
                <div className="ai-empty-state">
                    <div className="ai-sparkle-container">
                        <LuSparkles className="ai-sparkle-icon" />
                    </div>
                    <h2 className="ai-empty-title">How can I help you today?</h2>
                    
                    <div className="ai-actions-list">
                        <button className="ai-action-item">
                            <PiNotepad className="ai-action-icon" />
                            <span>Summarize this page</span>
                        </button>
                        <button className="ai-action-item">
                            <LuPresentation className="ai-action-icon" />
                            <span>Create a slide deck</span>
                        </button>
                        <button className="ai-action-item">
                            <LuLanguages className="ai-action-icon" />
                            <span>Translate this page</span>
                        </button>
                        <button className="ai-action-item">
                            <LuChartLine className="ai-action-icon" />
                            <span>Analyze for insights</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="ai-footer">
                <form onSubmit={handleSend}>
                    <div className="ai-input-wrapper">
                        <textarea 
                            className="ai-textarea" 
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
                        <div className="ai-input-controls">
                            <span className="ai-input-model">Knowledge Assistant</span>
                            <button type="submit" className="ai-send-btn" disabled={!inputValue.trim()}>
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
