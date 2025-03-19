import { Server } from "socket.io";
// for socket io to extend type
declare module "next" {
    interface NextApiResponse {
        socket: {
            server: any; // eslint-disable-line
            io?: Server;
        };
        status(code: number): NextApiResponse;
        json(data: any): NextApiResponse; // eslint-disable-line
    }
}
