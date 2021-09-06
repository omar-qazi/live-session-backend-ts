export type otCallbackFunction = (
  apiKey: string,
  sessionId: string,
  token: string,
  roomName: string
) => void;

export type otErrorFunction = (error: Error) => void;

export interface getSessionOptions {
  roomName: string;
  errorFunction: otErrorFunction;
  callbackFunction: otCallbackFunction;
}
