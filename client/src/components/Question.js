import React, { useState } from "react";
import Navbar from "./Navbar";

function ChatBox({ onClose }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, content: message }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Message sent:", data);
        setMessage("");
        setEmail("");
        onClose();
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="chat-box">
      <Navbar/>
      <div>
        <img src={`${process.env.PUBLIC_URL}/GiveStreamLogo.png`} alt="logo" />
      </div>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question here..."
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email for response"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatBox;
