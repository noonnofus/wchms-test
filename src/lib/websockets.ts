import { Notification } from "@/components/notification-system";
const userConnections: Map<number, WebSocket[]> = new Map();

export function registerUserConnection(userId: number, ws: WebSocket) {
    if (!userConnections.has(userId)) {
        userConnections.set(userId, []);
    }

    userConnections.get(userId)?.push(ws);

    ws.addEventListener("close", () => {
        const connections = userConnections.get(userId) || [];
        const index = connections.indexOf(ws);
        if (index !== -1) {
            connections.splice(index, 1);

            if (connections.length === 0) {
                userConnections.delete(userId);
            }
        }
    });
}

export function broadcastNotification(notification: Notification) {
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

export function broadcastToAll(message: any) {
    const messageStr = JSON.stringify(message);

    for (const connections of userConnections.values()) {
        for (const ws of connections) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(messageStr);
            }
        }
    }
}
