export default function NotificationCard({
    userId, // eslint-disable-line
    notificationType, // eslint-disable-line
    notificationMessage, // eslint-disable-line
}: {
    userId?: string;
    notificationType: string;
    notificationMessage: string;
}) {
    return (
        <div className="flex justify-center content-center">
            <div className="flex"></div>
        </div>
    );
}
