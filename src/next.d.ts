import { Server } from "socket.io";
// for socket io to extend type
declare module "next" {
    interface NextApiResponse {
        socket: {
            server: HTTPServer;
            io?: Server;
        };
        status(code: number): NextApiResponse;
        json(data: unknown): NextApiResponse;
    }
}
