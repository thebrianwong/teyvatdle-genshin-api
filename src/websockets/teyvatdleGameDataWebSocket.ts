import { Server } from "http";
import { WebSocketServer } from "ws";

const createWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  console.log("WebSocket server initialized.");

  wss.on("connection", () => {
    console.log("WebSocket connection established.");
  });

  wss.on("updateSolvedValue", (data) => {
    console.log(`Updated ${data.type}Solved to ${data.newSolvedValue}.`);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(data));
    });
  });

  return wss;
};

export default createWebSocketServer;
