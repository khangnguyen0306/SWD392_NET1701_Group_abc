import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7293/chatHub") // Ensure this matches your backend URL
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.onclose(() => this.start());
    }

    async start() {
        if (this.connection.state === signalR.HubConnectionState.Disconnected) {
            try {
                await this.connection.start();
                console.log("SignalR Connected.");
            } catch (err) {
                console.error("SignalR Connection Error:", err);
                setTimeout(() => this.start(), 5000);
            }
        }
    }

    async sendMessage(message) {
        try {
            await this.connection.invoke("SendMessage", message);
        } catch (err) {
            console.error("SignalR SendMessage Error:", err);
        }
    }

    async joinGroup(postId) {
        try {
            await this.connection.invoke("JoinGroup", postId);
        } catch (err) {
            console.error("SignalR JoinGroup Error:", err);
        }
    }

    async leaveGroup(postId) {
        try {
            await this.connection.invoke("LeaveGroup", postId);
        } catch (err) {
            console.error("SignalR LeaveGroup Error:", err);
        }
    }

    async loadMessagesByPostId(groupId) {
        try {
            await this.connection.invoke("LoadMessageByPostId", groupId);
        } catch (err) {
            console.error("SignalR LoadMessagesByPostId Error:", err);
        }
    }

    onReceiveMessage(callback) {
        this.connection.on("ReceiveMessage", callback);
    }

    onReceiveMessages(callback) {
        this.connection.on("ReceiveMessages", callback);
    }

    onReceiveNewGroup(callback) {
        this.connection.on("ReceiveNewGroup", callback);
    }
}

const signalRService = new SignalRService();
export default signalRService;
