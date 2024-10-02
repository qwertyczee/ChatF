import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import "./room.scss";

// Move socket connection outside the component
const socket = io('https://chat-b-rdcs-jkhkyjb7l-imjustmatthews-projects.vercel.app');

const Room = () => {
  const { id } = useParams(); // Get room ID from URL
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // Create a ref for the messages container

  useEffect(() => {
    // Join the room only once when component mounts
    socket.emit('join_room', id);

    // Listen for messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Clean up the message listener on unmount
      socket.off('message');
    };
  }, [id]);

  // Scroll to the bottom of the messages container
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Sending messages
  const sendMessage = () => {
    if (message) {
      socket.emit('send_message', { roomName: id, message });
      setMessage('');
    }
  };

  return (
    <div className="room-container">
      <h1>Room: {id}</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
        {/* This div acts as the scroll target */}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Room;
