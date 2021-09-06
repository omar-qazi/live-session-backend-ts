import OpenTok from "opentok";
import { KeyValue } from "./../../lib/keyValue";
import {
  otCallbackFunction,
  otErrorFunction,
  getSessionOptions,
} from "./types";

export class OpenTokHandler {
  private roomToSessionIdDictionary: KeyValue = {};
  private opentok: OpenTok;

  constructor(private apiKey: string, private apiSecret: string) {
    this.opentok = new OpenTok(apiKey, apiSecret);
  }

  private createSession(
    roomName: string,
    errorFunction: otErrorFunction,
    callbackFunction: otCallbackFunction
  ) {
    this.opentok.createSession({ mediaMode: "routed" }, (error, session) => {
      if (error) {
        console.log(error);
        errorFunction(error);
        return;
      }

      if (session) {
        this.roomToSessionIdDictionary[roomName] = session.sessionId;
        console.log(this.roomToSessionIdDictionary);
        const token: string = this.opentok.generateToken(session.sessionId);
        callbackFunction(this.apiKey, session.sessionId, token, roomName);
        return;
      }
    });
  }

  private fetchSession(roomName: string, callbackFunction: otCallbackFunction) {
    const sessionId: string = this.roomToSessionIdDictionary[roomName];
    console.log(sessionId);
    const token: string = this.opentok.generateToken(sessionId);
    callbackFunction(this.apiKey, sessionId, token, roomName);
  }

  getSession(options: getSessionOptions) {
    const { roomName, callbackFunction, errorFunction } = options;

    if (this.roomToSessionIdDictionary[roomName]) {
      this.fetchSession(roomName, callbackFunction);
    } else {
      this.createSession(roomName, errorFunction, callbackFunction);
    }
  }
}
