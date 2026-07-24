"use client";

import { useState, useRef, useEffect } from "react";
import { MdChat, MdClose, MdSend, MdSupportAgent } from "react-icons/md";
import styles from "./ChatWidget.module.css";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  time: string;
}

const now = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 👋 How can I help you today?",
      sender: "agent",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // While the chat is open, hide the WhatsApp FAB (it sits in the same corner
  // and would otherwise cover the chat's send button — see WhatsAppButton.css).
  useEffect(() => {
    document.body.classList.toggle("chat-open", open);
    return () => document.body.classList.remove("chat-open");
  }, [open]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      time: now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! Our team will get back to you shortly. For urgent matters, please call us at +971527540249.",
        sender: "agent",
        time: now(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      <div className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.agentAvatar}>
              <MdSupportAgent />
            </div>
            <div>
              <h4 className={styles.headerTitle}>Shebo Support</h4>
              <span className={styles.headerStatus}>
                <span className={styles.onlineDot} />
                Online
              </span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">
            <MdClose />
          </button>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.bubble} ${msg.sender === "user" ? styles.bubbleUser : styles.bubbleAgent}`}
            >
              <p className={styles.bubbleText}>{msg.text}</p>
              <span className={styles.bubbleTime}>{msg.time}</span>
            </div>
          ))}
          {typing && (
            <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
              <div className={styles.typingIndicator}>
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={styles.inputBar}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <MdSend />
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <button
        className={`${styles.fab} ${open ? styles.fabHidden : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open live chat"
        id="chat-widget-btn"
      >
        <MdChat />
        <span className={styles.fabPulse} />
      </button>
    </>
  );
}
