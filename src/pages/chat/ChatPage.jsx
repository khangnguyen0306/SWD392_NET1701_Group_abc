import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, List, Avatar, Input, Button, Spin } from 'antd';
import * as signalR from '@microsoft/signalr';
import { selectCurrentUser } from '../../slices/auth.slice';
import { addMessage, setSelectedChat } from '../../slices/chat.slice';


const { Header, Sider, Content } = Layout;

const ChatPage = () => {
    const dispatch = useDispatch();
    const { selectedChat, messages } = useSelector((state) => state.chat);
    const currentUser = useSelector(selectCurrentUser);
    const [messageText, setMessageText] = useState('');
    const [connection, setConnection] = useState(null);
    const messagesEndRef = useRef(null);

    // Mock data
    const chatOverviews = [
        { id: 1, participant: 'John Doe', lastMessage: 'Hey, how are you?' },
        { id: 2, participant: 'Jane Smith', lastMessage: 'Can we meet tomorrow?' }
    ];
    const chatMessagesMock = {
        1: [
            { sender: 'John Doe', message: 'Hey, how are you?' },
            { sender: 'You', message: 'I am good, thanks!' }
        ],
        2: [
            { sender: 'Jane Smith', message: 'Can we meet tomorrow?' },
            { sender: 'You', message: 'Sure, what time?' }
        ],
        3: [
            { sender: 'Alice', message: 'Hi there!' },
            { sender: 'You', message: 'Hello!' }
        ],
        // Add more sample messages as needed
    };

    useEffect(() => {
        if (selectedChat) {
            dispatch(addMessage(chatMessagesMock[selectedChat.id]));
        }
    }, [selectedChat, dispatch]);

    useEffect(() => {
        if (selectedChat) {
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(`https://yourbackendurl.com/chathub?transactionId=${selectedChat.id}`)
                .withAutomaticReconnect()
                .build();

            newConnection.start()
                .then(() => {
                    newConnection.on('ReceiveMessage', (user, message) => {
                        dispatch(addMessage({ sender: user, message }));
                    });
                })
                .catch((e) => console.error('Connection failed: ', e));

            setConnection(newConnection);
        }
    }, [selectedChat, dispatch]);

    const handleSendMessage = async () => {
        if (connection && connection.connectionStarted) {
            try {
                await connection.send('SendMessage', currentUser.id, messageText, selectedChat.id);
                dispatch(addMessage({ sender: 'You', message: messageText }));
                setMessageText('');
            } catch (e) {
                console.error('Sending message failed.', e);
            }
        } else {
            alert('No connection to server yet.');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Layout style={{ height: '100vh', marginTop: '7rem' }}>
            <Sider width={300} style={{ background: '#fff', borderRight: '1px solid #ddd' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={chatOverviews}
                    renderItem={(chat) => (
                        <List.Item
                            key={chat.id}
                            onClick={() => dispatch(setSelectedChat(chat))}
                            style={{ cursor: 'pointer', padding: '10px 20px' }}
                        >
                            <List.Item.Meta
                                avatar={<Avatar>{chat.participant[0]}</Avatar>}
                                title={<span>{chat.participant}</span>}
                                description={<span>{chat.lastMessage}</span>}
                            />
                        </List.Item>
                    )}
                />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 20px', borderBottom: '1px solid #ddd' }}>
                    <h2>{selectedChat ? selectedChat.participant : 'Select a chat'}</h2>
                </Header>
                <Content style={{ padding: '20px', overflowY: 'scroll' }}>
                    {selectedChat ? (
                        <div>
                            {messages.map((msg, index) => (
                                <div key={index} style={{ margin: '10px 0' }}>
                                    <b>{msg.sender}</b>: {msg.message}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        <div>Select a chat to start messaging</div>
                    )}
                    {selectedChat && (
                        <div style={{ marginTop: '20px' }}>
                            <Input
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Type a message"
                                style={{ marginBottom: '10px' }}
                            />
                            <Button type="primary" onClick={handleSendMessage}>
                                Send
                            </Button>
                        </div>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ChatPage;
