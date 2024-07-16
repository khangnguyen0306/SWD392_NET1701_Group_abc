import React, { useCallback, useEffect, useRef, useState } from 'react';
import signalRService from '../../services/chatAPI'; // Assuming this is correctly imported
import { Avatar, Button, Card, Col, Input, Layout, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';
import { UserOutlined } from '@ant-design/icons';
import _ from 'lodash';
const Chat = () => {
    const [groups, setGroups] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const loadedGroupIdsRef = useRef([]);
    const user = useSelector(selectCurrentUser);


    //

    useEffect(() => {

        let timeoutId;

        const fetchData = async () => {
            try {

                await signalRService.start();
                // Handle receiving all group chats
                const handleReceiveAllGroupChats = (groupDtos) => {
                    groupDtos.forEach((groupDto) => {
                        if (!loadedGroupIdsRef.current.includes(groupDto.id)) {
                            setGroups((prevGroups) => {
                                const isDuplicate = prevGroups.some(group => group.id === groupDto.id);
                                if (!isDuplicate) {
                                    return [...prevGroups, groupDto];
                                }
                                return prevGroups;
                            });
                            loadedGroupIdsRef.current.push(groupDto.id);
                        }
                    });
                };


                // Handle receiving messages
                const handleReceiveMessages = (receivedMessages) => {
                    setMessages(receivedMessages);
                };

                // Register event handlers for SignalR events
                signalRService.onReceiveAllGroupChats(handleReceiveAllGroupChats);
                signalRService.onReceiveMessages(handleReceiveMessages);
                signalRService.onReceiveNewGroup((newGroup) => {
                    console.log('New group received:', newGroup);
                    // Optionally update state with new group
                    setGroups((prevGroups) => [...prevGroups, newGroup]);
                });

                // Fetch all group chats for the user
                await signalRService.getAllGroupChat(user.id);
                if (selectedGroupId) {
                    await signalRService.LoadMessageByGroupId(selectedGroupId);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                // Schedule the next call after 1 second
                timeoutId = setTimeout(fetchData, 1000);
            }
        };

        // Start fetching data initially
        fetchData();

        // Clean up timeout on component unmount
        return () => {
            clearTimeout(timeoutId);
            // signalRService.stop();
        };
    }, [selectedGroupId]); // Adding selectedGroupId to dependency array


    // Function to handle clicking on a group to load messages
    const handleGroupClick = async (groupId) => {
        setSelectedGroupId(groupId);
        try {
            const messages = await signalRService.LoadMessageByGroupId(groupId);
            setMessages(messages);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    // Function to handle sending a message
    const handleSendMessage = async () => {
        if (messageInput.trim() !== '') {
            const message = {
                SenderId: user.id,
                GroupId: selectedGroupId,
                Content: messageInput,
                CreatedDate: new Date().toISOString(),
            };

            try {
                // Send message via SignalR service
                await signalRService.sendMessage(message);

                // Clear message input after sending
                setMessageInput('');

                // Fetch and update messages for the selected group
                if (selectedGroupId) {
                    const messages = await signalRService.LoadMessageByGroupId(selectedGroupId);
                    setMessages(messages);
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }

    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <Layout style={{ marginTop: '100px', width: '100%', justifyContent: 'center' }}>
            <Row style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Col md={8} style={{ marginRight: '1rem' }}>
                    <Card hoverable>
                        <h2>All group chat</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '400px', overflowY: 'auto' }}>
                            {groups?.map((group) => (
                                <Card key={group.id} style={{ padding: '6px', margin: '10px' }} hoverable onClick={() => handleGroupClick(group.id)}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            size={'large'}
                                            style={{
                                                backgroundColor: '#f56a00',
                                                verticalAlign: 'middle',
                                            }}
                                        >
                                            <p>{group.id}</p>
                                        </Avatar>
                                        <p style={{ marginLeft: '1rem' }}>Group: {group.id}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </Col>
                {/* Messages for selected group */}
                <Col md={8}>
                    {selectedGroupId ? (
                        <>
                            <div className="messages-section" style={{ height: '400px', overflowY: 'auto' }}>
                                <Card>
                                    {messages?.map((message, index) => (
                                        <div key={index}>
                                            {user.id !== message.senderId ? (
                                                <Card style={{ width: 'fit-content', margin: '10px', minWidth: '50px' }}
                                                    bodyStyle={{ padding: '15px' }}>
                                                    <p><Avatar icon={<UserOutlined />} style={{ marginRight: '1rem' }} /><span>{message.content}</span></p>
                                                </Card>
                                            ) : (
                                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                                    <Card style={{ width: 'fit-content', margin: '10px', minWidth: '100px', textAlign: 'right', backgroundColor: '#5c98f2', color: '#fff' }}
                                                        bodyStyle={{ padding: '15px' }}>
                                                        <p><span>{message.content}</span> <Avatar src={user.imgUrl} style={{ marginLeft: '1rem' }} /></p>
                                                    </Card>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </Card>
                            </div>

                            <div className="chat-input" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                <Input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={messageInput}
                                    onKeyDown={handleKeyPress}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    style={{ flexGrow: 1, marginRight: '10px' }}
                                />
                                <Button onClick={handleSendMessage}>Send</Button>
                            </div>
                        </>
                    ) : (
                        <div className="messages-section" style={{ height: '400px', overflowY: 'auto' }}>
                            <Card>
                                
                            </Card>
                        </div>
                    )}
                </Col>
            </Row>
        </Layout>
    );
};

export default Chat;