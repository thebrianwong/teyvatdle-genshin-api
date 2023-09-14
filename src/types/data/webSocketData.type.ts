type WebSocketDataKeys =
  | "character"
  | "weapon"
  | "food"
  | "talent"
  | "constellation";

type WebSocketData = {
  type: WebSocketDataKeys;
  newSolvedValue: number;
};

export type { WebSocketData, WebSocketDataKeys };
