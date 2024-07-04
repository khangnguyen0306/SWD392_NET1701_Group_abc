// services/signalRService.js
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl("YOUR_SIGNALR_HUB_URL")
            .configureLogging(LogLevel.Information)
            .build();

        this.connection.on("ReceiveMessage", (user, message) => {
            console.log("Message received:", user, message);
        });
    }

    async start() {
        try {
            await this.connection.start();
            console.log("SignalR Connected.");
        } catch (err) {
            console.log("Error while establishing connection: ", err);
            setTimeout(() => this.start(), 5000);
        }
    }

    async sendMessage(user, message) {
        try {
            await this.connection.invoke("SendMessage", user, message);
        } catch (err) {
            console.error(err);
        }
    }

    onMessage(callback) {
        this.connection.on("ReceiveMessage", callback);
    }
}

const signalRService = new SignalRService();
export default signalRService;
