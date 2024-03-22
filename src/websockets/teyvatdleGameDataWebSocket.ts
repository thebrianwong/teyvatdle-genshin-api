import { Server } from "http";
import { WebSocketServer } from "ws";

const createWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  console.log("WebSocket server initialized.");

  wss.on("connection", () => {
    console.log("WebSocket connection established.");
  });

  return wss;
};

export default createWebSocketServer;
