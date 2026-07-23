import React, { useState, useEffect, useRef } from 'react';
import { RxDoubleArrowRight } from "react-icons/rx";
import { BsSend } from "react-icons/bs";
import { PiNotepad } from "react-icons/pi";
import { ImAttachment } from 'react-icons/im';
import { LuSparkles, LuLanguages, LuPresentation, LuChartLine, LuFileText, LuBot } from "react-icons/lu";

import { UPLOAD_RAG_PDF } from "../api/auth";
import { ask_question } from "../api/auth";

// ==================================
// AI Panel Component
// ==================================


function AiPanel({ onClose, mode = "sidebar" }) {
    const [animate, setAnimate] = useState(false);
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [llmResponse, setLlmResponse] = useState("");

    // Chat mode: 'rag' (Document RAG) vs 'ai' (Direct AI Chat)
    const [chatMode, setChatMode] = useState("ai");

    const messagesEndRef = useRef(null);
    const fileinputRef = useRef(null);

    const [pdfUrl, setPdfUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploaded, setIsUploaded] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");

    // Auto-scroll to bottom whenever messages update or typing indicator state changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

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

    const openFileExplorer = () => {
        fileinputRef.current?.click();
    };

    const handlefilechange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPdfUrl(URL.createObjectURL(selectedFile));
            setChatMode("rag"); // Automatically switch to RAG mode when document is uploaded
        }
    };

    const handleUploadPDF = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        setMessage("Uploading…");

        try {
            const data = await UPLOAD_RAG_PDF(formData);
            setMessage(data.message || "Uploaded successfully");
            setIsUploaded(true);
            setUploadedFileName(file.name);
        } catch (error) {
            console.log("Full error:", error);
        }
    };

    // Core Send Handler: Instantly shows user message before fetching LLM response
    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if ((!query.trim() && !file) || isSending) return;

        const sentQuery = query;
        setQuery("");

        // 1. Immediately append user message so it appears right away in UI
        const currentMsgIndex = messages.length;
        const pendingUserMsg = {
            user: sentQuery,
            Llm: null,
            mode: chatMode,
            failedQuestion: sentQuery
        };

        setMessages(prev => [...prev, pendingUserMsg]);
        setIsSending(true);
        setIsTyping(true);

        const hasDoc = Boolean(file || pdfUrl || isUploaded);

        // 2. If in RAG mode but NO document has been uploaded yet -> Do NOT search RAG, ask user to switch or upload
        if (chatMode === 'rag' && !hasDoc) {
            setTimeout(() => {
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        user: sentQuery,
                        Llm: { answer: "No document has been uploaded yet. Please attach a PDF to use RAG mode, or switch to Direct AI mode." },
                        mode: 'rag',
                        canFallbackToAI: true,
                        failedQuestion: sentQuery
                    };
                    return updated;
                });
                setIsTyping(false);
                setIsSending(false);
            }, 300);
            return;
        }

        // Upload PDF if pending
        if (file && !isUploaded) {
            await handleUploadPDF();
        }

        // 3. Perform query call based on active mode
        try {
            const response = await ask_question({ "question": sentQuery, "mode": chatMode });
            setLlmResponse(response);

            setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                updated[lastIdx] = {
                    user: sentQuery,
                    Llm: response,
                    mode: chatMode,
                    failedQuestion: sentQuery
                };
                return updated;
            });
        } catch (err) {
            console.error(err);
            setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                updated[lastIdx] = {
                    user: sentQuery,
                    Llm: { answer: "The AI service is currently unavailable. Please try again later." },
                    mode: chatMode,
                    failedQuestion: sentQuery
                };
                return updated;
            });
        } finally {
            setIsTyping(false);
            setIsSending(false);
        }
    };

    // Handler for "Ask the AI instead" fallback button
    const handleAskAIInstead = async (userQuestion) => {
        if (!userQuestion || isSending) return;

        setChatMode("ai"); // Switch to Direct AI mode
        setIsSending(true);
        setIsTyping(true);

        const pendingMsg = {
            user: `(Direct AI Fallback) ${userQuestion}`,
            Llm: null,
            mode: "ai"
        };

        setMessages(prev => [...prev, pendingMsg]);

        try {
            const response = await ask_question({ "question": userQuestion, "mode": "ai" });
            setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                updated[lastIdx] = {
                    user: `Ask AI instead: "${userQuestion}"`,
                    Llm: response,
                    mode: "ai"
                };
                return updated;
            });
        } catch (err) {
            console.error(err);
            setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                updated[lastIdx] = {
                    user: userQuestion,
                    Llm: { answer: "Failed to get response from Direct AI." },
                    mode: "ai"
                };
                return updated;
            });
        } finally {
            setIsTyping(false);
            setIsSending(false);
        }
    };

    const suggestionButtons = [
        { icon: <PiNotepad className="aiIcon" />, title: "Summarize this page", text: "Please summarize this document/page." },
        { icon: <LuPresentation className="aiIcon" />, title: "Automate a task", text: "Help me automate a workflow or task." },
        { icon: <LuLanguages className="aiIcon" />, title: "Translate this page", text: "Translate the content of this document." },
        { icon: <LuChartLine className="aiIcon" />, title: "Analyze PDF", text: "Analyze the uploaded PDF file for key insights." }
    ];

    return (
        <div className={`aiPanel ${mode === 'fullscreen' ? 'fullscreen' : animate ? 'open' : ''}`}>
            {/* Top Bar Header with Mode Switcher */}
            <div className="aiTop">
                <div className="aiTopTitleGroup">
                    <h3>AI Chat</h3>
                    {/* Mode Toggle Pills */}
                    <div className="aiModeToggle">
                        <button
                            type="button"
                            className={`aiModeBtn ${chatMode === 'rag' ? 'active' : ''}`}
                            onClick={() => setChatMode('rag')}
                            title="Document Search Mode (RAG)"
                        >
                            <LuFileText /> RAG
                        </button>
                        <button
                            type="button"
                            className={`aiModeBtn ${chatMode === 'ai' ? 'active' : ''}`}
                            onClick={() => setChatMode('ai')}
                            title="General AI Chat Mode"
                        >
                            <LuBot /> Direct AI
                        </button>
                    </div>
                </div>

                {mode !== 'fullscreen' && (
                    <button className="aiClose" onClick={handleClose} title="Close AI Panel">
                        <RxDoubleArrowRight />
                    </button>
                )}
            </div>

            {/* Sticky Navbar for Suggestion Buttons when Chat is Active */}
            {messages.length > 0 && (
                <div className="aiNavbar">
                    <div className="aiNavOptions">
                        {suggestionButtons.map((item, index) => (
                            <button
                                key={index}
                                className="aiNavOptionBtn"
                                onClick={() => setQuery(item.text)}
                                type="button"
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Area: Centered Landing vs Conversational Chat */}
            <div className="aiMain">
                {messages.length === 0 ? (
                    /* Centered Empty Landing State */
                    <div className="aiEmpty">
                        <div className="aiSparkle">
                            <LuSparkles className="aiIcon" />
                        </div>
                        <h2 className="aiTitle">How can I help you today?</h2>

                        {/* Mode Indicator Banner on Landing Page */}
                        <div className="aiModeBanner">
                            Mode: <strong>{chatMode === 'rag' ? '📄 Document RAG' : '✨ Direct AI Chat'}</strong>
                            {chatMode === 'rag' && !(file || pdfUrl || isUploaded) && (
                                <span className="aiModeNotice"> (Attach a PDF to search document)</span>
                            )}
                        </div>

                        <div className="aiOptions">
                            {suggestionButtons.map((item, index) => (
                                <button
                                    key={index}
                                    className="aiOption"
                                    onClick={() => setQuery(item.text)}
                                    type="button"
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Conversational Chat Stream */
                    <div className="aiMessages">
                        {messages.map((msg, index) => {
                            const aiAnswer =
                                typeof msg.Llm === 'object' && msg.Llm !== null
                                    ? (msg.Llm.answer || msg.Llm.text || JSON.stringify(msg.Llm))
                                    : (msg.Llm || msg.text);

                            // Check if RAG failed to find answer or if notice
                            const isNotFound =
                                msg.canFallbackToAI ||
                                (aiAnswer && (
                                    aiAnswer.includes("could not find that information") ||
                                    aiAnswer.includes("No document has been uploaded")
                                ));

                            return (
                                <React.Fragment key={index}>
                                    {/* User Chat Bubble */}
                                    {msg.user && (
                                        <div className="aiMessage aiMessageUser">
                                            <div className="aiBubble">{msg.user}</div>
                                        </div>
                                    )}

                                    {/* AI Assistant Chat Bubble */}
                                    {aiAnswer && (
                                        <div className="aiMessage aiMessageAI">
                                            <div className="aiAvatar">
                                                <LuSparkles />
                                            </div>
                                            <div className="aiBubbleContainer">
                                                <div className="aiBubble">{aiAnswer}</div>

                                                {/* "Ask the AI instead" Fallback Button */}
                                                {isNotFound && (
                                                    <button
                                                        type="button"
                                                        className="aiAskInsteadBtn"
                                                        onClick={() => handleAskAIInstead(msg.failedQuestion || msg.user)}
                                                    >
                                                        <LuSparkles /> Ask the AI instead
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}

                        {/* Typing Indicator Animation */}
                        {isTyping && (
                            <div className="aiMessage aiMessageAI">
                                <div className="aiAvatar">
                                    <LuSparkles />
                                </div>
                                <div className="aiBubble aiTyping">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Fixed Bottom Input Area */}
            <div className="aiBottom aiInputArea">
                <form onSubmit={handleSend}>
                    {pdfUrl && (
                        <div className="pdfName">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                                <path fill="#F5F5F5" d="M16 4h24l16 16v36a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" />
                                <path fill="#E53935" d="M40 4v16h16" />
                                <rect x="10" y="38" width="44" height="16" rx="4" fill="#D32F2F" />
                                <text x="32" y="50" textAnchor="middle" fontSize="10" fontFamily="Arial" fill="white" fontWeight="bold">PDF</text>
                            </svg>
                            <p>{file?.name}</p>
                        </div>
                    )}
                    <div className="aiInput">
                        <textarea
                            className="aiTextarea"
                            placeholder={chatMode === 'rag' ? "Ask about your PDF..." : "Chat with AI..."}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                            disabled={isSending}
                        />
                        <div className="aiControls">
                            <button
                                type="button"
                                className="attachment-icon"
                                onClick={openFileExplorer}
                                title="Attach PDF"
                            >
                                <ImAttachment />
                            </button>
                            <input
                                type="file"
                                ref={fileinputRef}
                                accept="application/pdf"
                                onChange={handlefilechange}
                                style={{ display: 'none' }}
                            />
                            <span className="aiModel">
                                {chatMode === 'rag' ? '📄 RAG Mode' : '✨ Direct AI Mode'}
                            </span>
                            <button
                                type="submit"
                                className="aiSend"
                                disabled={(!query.trim() && !file) || isSending}
                            >
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

