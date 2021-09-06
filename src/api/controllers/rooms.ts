import { Request, Response, NextFunction } from "express";
import HttpException from "../lib/exception";
import { HttpStatusCode } from "../util/statusCodes";
import { OpenTokHandler } from "../services/tokbox";

const apiKey = process.env.apiKey;
const apiSecret = process.env.apiSecret;

exports.test = (req: Request, res: Response) => {
  res.status(200).json({ data: `TEST SUCCESSFULL!` });
};

exports.getSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!(apiKey && apiSecret)) {
      return;
    }

    const roomName: string = req.params.name;
    console.log(
      "attempting to create a session associated with the room: " + roomName
    );

    const opentok = new OpenTokHandler(apiKey, apiSecret);

    opentok.getSession({
      roomName: roomName,
      errorFunction: (error) => {
        res.status(500).send({ error: "createSession error:" + error });
      },
      callbackFunction: (apiKey, sessionId, token, roomName) => {
        res.status(200).json({
          apiKey,
          sessionId,
          token,
          name: roomName,
        });
      },
    });

    return;
  } catch (error) {
    console.log(error);
    next(
      new HttpException(
        HttpStatusCode.INTERNAL_SERVER,
        "Something went wrong in the API Controller!"
      )
    );
  }
};
