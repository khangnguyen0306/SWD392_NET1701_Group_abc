import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import signalRService from '../../services/chatAPI'; 
import * as signalR from '@microsoft/signalr';

const Chat = () => {
    const messages = useSelector((state) => state.chat.messages);
    const [inputMessage, setInputMessage] = useState('');
    const [postId, setPostId] = useState(1); // Example postId, replace with actual value

    useEffect(() => {
        signalRService.start();

        signalRService.onReceiveMessage((message) => {
            console.log("Received message:", message);
            // Update your message state here
        });

        signalRService.onReceiveMessages((messages) => {
            console.log("Received messages:", messages);
            // Update your message state here
        });

        signalRService.onReceiveNewGroup((group) => {
            console.log("Received new group:", group);
            // Handle new group logic here
        });

        // Join group when component mounts
        signalRService.joinGroup(postId);

        return () => {
            // Leave group when component unmounts
            signalRService.leaveGroup(postId);
            if (signalRService.connection.state === signalR.HubConnectionState.Connected) {
                signalRService.connection.stop();
            }
        };
    }, [postId]);

    const handleSendMessage = async () => {
        const user = "User"; 
        const message = {
            user,
            content: inputMessage,
            postId,
            timestamp: new Date()
        };
        await signalRService.sendMessage(message);
        setInputMessage('');
    };

    return (
        <div className="chat-container" style = {{marginTop:'100px'}}>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <strong>{msg.user}</strong>: {msg.message}
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button className="chat-send-button" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
