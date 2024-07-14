import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7293/chatHub")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onreconnected(this.onReconnected.bind(this));
    this.connection.onclose(this.onClose.bind(this));
    this.connection.onreconnecting(this.onReconnecting.bind(this));
  }

  async start() {
    try {
      await this.connection.start();
      console.log("SignalR Connected.");
    } catch (err) {
      console.log("SignalR Connection Error: ", err);
      setTimeout(() => this.start(), 5000);
    }
  }

  on(event, callback) {
    this.connection.on(event, callback);
  }

  off(event, callback) {
    this.connection.off(event, callback);
  }

  async sendMessage(user, message) {
    try {
      await this.connection.invoke("SendMessage", { user, content: message });
    } catch (err) {
      console.error("Send message error: ", err);
    }
  }

  async onReconnected(connectionId) {
    console.log("SignalR Reconnected: ", connectionId);
  }

  async onClose(error) {
    console.log("SignalR Connection Closed. Error: ", error);
    await this.start();
  }

  async onReconnecting(error) {
    console.log("SignalR Reconnecting. Error: ", error);
  }
}

const signalRService = new SignalRService();
export default signalRService;
