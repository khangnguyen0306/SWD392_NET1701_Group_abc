// components/Chat.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import signalRService from '../../services/chatAPI'; 

const Chat = () => {
    const messages = useSelector((state) => state.chat.messages);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        signalRService.start();
    }, []);

    const handleSendMessage = async () => {
        const user = "User"; 
        await signalRService.sendMessage(user, inputMessage);
        setInputMessage('');
    };

    return (
        <div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user}</strong>: {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chat;
