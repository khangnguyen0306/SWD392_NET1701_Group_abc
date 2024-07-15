import React, { useEffect, useState } from 'react';
import signalRService from '../../services/chatAPI'; // Assuming this is correctly imported
import { Button, Input } from 'antd';

const Chat = () => {
    const [groupName, setGroupName] = useState('');
    const [groups, setGroups] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        const userId = 1036;
        let timeoutId;

        const fetchData = async () => {
            try {
                signalRService.start();

                // Handle receiving all group chats
                const handleReceiveAllGroupChats = (groupDtos) => {
                    setGroups(groupDtos);
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
                });

                // Fetch all group chats for the user
                signalRService.getAllGroupChat(userId);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                // Schedule the next call after 3 seconds
                timeoutId = setTimeout(fetchData, 3000);
            }
        };

        // Start fetching data initially
        fetchData();

        // Clean up timeout on component unmount
        return () => {
            clearTimeout(timeoutId);
        };
    }, []); // Empty dependency array ensures this Empty dependency array ensures this effect runs only once on mount

    // Function to handle creating a new group
    const handleCreateGroup = async () => {
        const group = {
            name: groupName,
            postId: 32,
            userExchangeId: 1036,
        };
        await signalRService.createGroup(group); // Assuming createGroup method exists in signalRService
        setGroupName(''); // Clear group name input after creation
    };

    // Function to handle clicking on a group to load messages
    const handleGroupClick = async (groupId) => {
        setSelectedGroupId(groupId);
        await signalRService.LoadMessageByGroupId(groupId); // Adjust method name as per your service
    };

    // Function to handle sending a message
    const handleSendMessage = () => {
        if (messageInput.trim() !== '') {
            const message = {
                SenderId: 1036, // Replace with actual sender ID logic if needed
                GroupId: selectedGroupId, // Use selectedGroupId or actual logic to determine group ID
                Content: messageInput,
                CreatedDate: new Date().toISOString(), // Example timestamp, adjust as needed
            };

            // Send message via SignalR service
            signalRService.sendMessage(message);

            // Clear message input after sending
            setMessageInput('');
        }
    };

    return (
        <div className="chat-container" style={{ marginTop: '100px' }}>
            {/* Group creation UI */}
            <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="group-input"
            />
            <button onClick={handleCreateGroup} className="create-group-button">
                Create Group
            </button>

            {/* List of groups */}
            <h2>Groups</h2>
            <ul>
                {groups.map((group) => (
                    <li key={group.id}>
                        {`Group ID: ${group.id}, Post ID: ${group.postId}`}
                        <Button onClick={() => handleGroupClick(group.id)}>Load Messages</Button>
                    </li>
                ))}
            </ul>

            {/* Messages for selected group */}
            {selectedGroupId && (
                <div className="messages-section">
                    <h2>Messages for Group ID: {selectedGroupId}</h2>
                    <ul>
                        {messages.map((message) => (
                            <li key={message.id}>{message.content}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Message input and send button */}
            <div className="chat-input">
                <Input
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button onClick={handleSendMessage}>Send</Button>
            </div>
        </div>
    );
};

export default Chat;
