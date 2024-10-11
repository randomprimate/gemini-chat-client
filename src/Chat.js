import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000', {
  transports: ['websocket', 'polling']
});

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to the server');
        });

        socket.on('message', (msg) => {
            console.log('Message received from server:', msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (message) {
            console.log('Sending message:', message); 
            socket.emit('message', message);
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
