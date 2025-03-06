import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

export const config = {
    api: {
        bodyParser: false,
    },
};

let io: Server;

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        res.status(200).json({ message: "Socket API" });
    }
};

export const socketHandler = (req: NextApiRequest, res: NextApiResponse) => {
    if (res.socket.server.io) {
        console.log("Socket.io is already running");
        return handler(req, res);
    }

    const ioServer = new Server(res.socket.server);

    ioServer.on("connection", (socket) => {
        console.log("a user connected");

        socket.on("message", (data) => {
            console.log("Received message: ", data);
            socket.emit("message", "Server");
        });

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });

    res.socket.server.io = ioServer;
    console.log("Socket.io initialized");
    return handler(req, res);
};

export default socketHandler;
