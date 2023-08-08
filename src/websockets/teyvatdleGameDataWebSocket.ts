import { Server } from "http";
import { WebSocketServer } from "ws";

const createWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", () => {
    console.log("WebSocket server initialized.");
  });

  wss.on("updateSolvedValue", (type, data) => {
    console.log(`Updated ${type}Solved to ${data[`${type}_solved`]}.`);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(data));
    });
  });

  return wss;
};

export default createWebSocketServer;
