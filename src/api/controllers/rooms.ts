import { Request, Response, NextFunction } from "express";
import { Session } from "opentok";
import opentok from "../services/tokbox/tokbox";
import { KeyValue } from "../lib/keyValue";
import HttpException from "../lib/exception";
import { HttpStatusCode } from "../util/statusCodes";
const apiKey = process.env.TOKBOX_API_KEY

var roomToSessionIdDictionary: KeyValue = {};

exports.test = (req: Request, res: Response) => {
    res.status(200).json({data: `TEST SUCCESSFULL!`});
}

exports.getSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roomName: string = req.params.name;
        console.log('attempting to create a session associated with the room: ' + roomName);

        // if the room name is associated with a session ID, fetch that
        if (roomToSessionIdDictionary[roomName]) {
            const sessionId: string = roomToSessionIdDictionary[roomName];
            console.log(sessionId);

            // generate token
            const token: string = opentok.generateToken(sessionId);
            
            res.status(200).json({
                apiKey,
                sessionId,
                token,
                name: roomName,
            });
        }
        // if this is the first time the room is being accessed, create a new session ID
        else {
            opentok.createSession({ mediaMode: 'routed' }, function (err: any, session: Session) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ error: 'createSession error:' + err });
                    return;
                }

                roomToSessionIdDictionary[roomName] = session.sessionId;

                console.log(roomToSessionIdDictionary);

                // generate token
                const token: string = opentok.generateToken(session.sessionId);

                res.status(200).json({
                    apiKey: apiKey,
                    sessionId: session.sessionId,
                    token: token,
                    name: roomName
                });
            });
        }
    } catch (error) {
        console.log(error);
        next(new HttpException(HttpStatusCode.INTERNAL_SERVER, "Something went wrong in the API Controller!"));
    }
}