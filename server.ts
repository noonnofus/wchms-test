import next from "next";
import {
    createServer,
    IncomingMessage,
    Server,
    ServerResponse,
} from "node:http";
import { Socket } from "node:net";
import { parse } from "node:url";
import { WebSocket, WebSocketServer } from "ws";

const userConnections: Map<number, WebSocket[]> = new Map();
const clients: Set<WebSocket> = new Set();

function registerUserConnection(userId: number, ws: WebSocket) {
    if (!userConnections.has(userId)) {
        userConnections.set(userId, []);
    }
    userConnections.get(userId)?.push(ws);
    console.log(`User ${userId} registered with websocket connection`);
}

function broadcastNotification(notification: any) {
    const userId = notification.userId;
    const connections = userConnections.get(userId);

    if (connections && connections.length > 0) {
        const message = JSON.stringify({
            event: "notification",
            notification,
        });

        connections.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(message);
            }
        });
    }
}

function broadcastToAll(message: any) {
    const messageStr = JSON.stringify(message);

    for (const connections of userConnections.values()) {
        for (const ws of connections) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(messageStr);
            }
        }
    }
}

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const server: Server = createServer(
        (req: IncomingMessage, res: ServerResponse) => {
            handle(req, res, parse(req.url || "", true));
        }
    );

    const wss = new WebSocketServer({ noServer: true });

    wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
        clients.add(ws);

        ws.on("message", (message: Buffer, isBinary: boolean) => {
            const msgStr = message.toString();
            console.log(`Message received: ${msgStr}`);

            try {
                const data = JSON.parse(msgStr);

                if (data.event === "identify" && data.userId) {
                    const userId = parseInt(data.userId);
                    registerUserConnection(userId, ws);
                    return;
                }

                if (data.event === "ping") {
                    ws.send(JSON.stringify({ event: "pong" }));
                    return;
                }
                if (data.event === "course_material_created") {
                    const { courseId, materialId, userIds } = data;

                    userIds.forEach((userId: number) => {
                        const notification = {
                            userId,
                            type: "course_material",
                            title: "New Course Material Available",
                            message: `A new material has been added to course ${courseId}.`,
                            metadata: {
                                courseId,
                                materialId,
                            },
                        };

                        broadcastNotification(notification);
                    });
                    return;
                }

                clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message, { binary: isBinary });
                    }
                });
            } catch (error) {
                console.error("Error parsing websocket message:", error);
            }
        });

        ws.on("close", () => {
            clients.delete(ws);

            for (const [userId, connections] of userConnections.entries()) {
                const index = connections.indexOf(ws);
                if (index !== -1) {
                    connections.splice(index, 1);

                    if (connections.length === 0) {
                        userConnections.delete(userId);
                    }
                    break;
                }
            }

            console.log("Client disconnected");
        });
    });

    server.on(
        "upgrade",
        (req: IncomingMessage, socket: Socket, head: Buffer) => {
            const { pathname } = parse(req.url || "/", true);

            if (pathname === "/_next/webpack-hmr") {
                nextApp.getUpgradeHandler()(req, socket, head);
            }

            if (pathname === "/api/ws") {
                wss.handleUpgrade(req, socket, head, (ws) => {
                    wss.emit("connection", ws, req);
                });
            }
        }
    );

    server.listen(3000);
    console.log("Server listening on port 3000");

    (global as any).broadcastNotification = broadcastNotification;
    (global as any).broadcastToAll = broadcastToAll;
});
