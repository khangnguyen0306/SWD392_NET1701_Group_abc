import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = null;
        this.start();
    }

    async start() {
        if (this.connection && this.connection.state !== signalR.HubConnectionState.Disconnected) {
            console.log('SignalR connection is already active or in a non-disconnected state.');
            return;
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7293/chatHub')
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.onclose(() => {
            console.log('SignalR connection closed. Attempting to reconnect...');
            this.start();
        });

        try {
            await this.connection.start();
            console.log('SignalR Connected');
        } catch (err) {
            console.error('Error while establishing connection: ' + err);
            setTimeout(() => this.start(), 5000); // Retry connection every 5 seconds
        }
    }

    async invoke(methodName, ...args) {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            console.log('SignalR connection is not active. Attempting to start...');
            await this.start();
        }
        return this.connection.invoke(methodName, ...args);
    }

    onReceiveNewGroup(callback) {
        this.connection.on('ReceiveNewGroup', callback);
    }

    onReceiveMessage(callback) {
        this.connection.on('ReceiveMessage', callback);
    }

    onReceiveMessages(callback) {
        this.connection.on('ReceiveMessages', callback);
    }

    onReceiveAllGroupChats(callback) {
        this.connection.on('ReceiveAllGroupChats', callback);
    }

    createGroup(group) {
        this.invoke('CreateGroup', group).catch(err => console.error('Error creating group:', err));
    }

    getAllGroupChat(userId) {
        this.invoke('GetAllGroupChat', userId).catch(err => console.error('Error fetching group chats:', err));
    }
    offReceiveMessages() {
        this.connection.off('ReceiveMessages');
    }

    offReceiveAllGroupChats() {
        this.connection.off('ReceiveAllGroupChats');
    }
    joinGroup(postId) {
        this.invoke('JoinGroup', postId).catch(err => console.error('Error joining group:', err));
    }

    leaveGroup(postId) {
        this.invoke('LeaveGroup', postId).catch(err => console.error('Error leaving group:', err));
    }

    joinAllGroup(userId) {
        this.invoke('JoinAllGroup', userId).catch(err => console.error('Error joining all groups:', err));
    }

    sendMessage(message) {
        this.invoke('SendMessage', message).catch(err => console.error('Error sending message:', err));
    }
    

    async LoadMessageByGroupId(groupId) {
        try {
            const messages = await this.invoke('LoadMessageByGroupId', groupId);
            
            // console.log('Messages loaded for group:', groupId, messages);
            return messages;
        } catch (error) {
            console.error('Error loading messages for group:', groupId, error);
            return null;
        }
    }
}

const signalRService = new SignalRService();
export default signalRService;
