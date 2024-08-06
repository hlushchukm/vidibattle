import { useEffect, useState } from "react";
import SinglePostHeader from "./components/SinglePostHeader";
import PageLoading from "../../components/PageLoading";
import ShareModal from "../../components/ShareModal";
import { get, update } from "../../services/crud";
import { getSocket } from "../../services/socket";
import { formatResourceURL, handleProfileImageError } from "../../services/asset-paths";
import { getName } from "../../services/utils";
import { useCurrentUserStore } from "../../store";
import { getDateAndTime } from "../../services/timeAndDate";


export default function Notification() {
    const socket = getSocket();
    const [notifications, setNotifications] = useState<any>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const currentUserId = useCurrentUserStore((state: any) => state.id);

    useEffect(() => {
        fetchNotifications();

        const handleNewNotification = (notification: any) => {           
            if (currentUserId !== notification?.creator?._id) {
                setNotifications((prevNotifications: any) => [...prevNotifications, notification]);
                if (!notification.read) {
                    markNotificationAsSeen(notification._id);
                }
            }
        };

        socket?.on('NEW_NOTIFICATION', handleNewNotification);

        socket?.on('READ_NOTIFICATION', (updatedNotification) => {
            setNotifications((prevNotifications: any) =>
                prevNotifications.map((notification: any) =>
                    notification._id == updatedNotification._id ? { ...updatedNotification, read: true } : notification
                )
            );
        });

        return () => {
            socket?.off('NEW_NOTIFICATION', handleNewNotification);
        };
    }, []);

    const fetchNotifications = async () => {
        await get("notification/")
            .then((res) => {
                setNotifications(res.data);
                setPageLoading(false);

                // Mark all messages as seen after loading
                res?.data?.forEach((notification: any) => {                    
                    if (!notification.read && notification?.to?._id == currentUserId) {
                        markNotificationAsSeen(notification._id);
                    }
                });
            })
            .catch((e) => {
                console.log(e);
                setPageLoading(false);
            });
    };

    const markNotificationAsSeen = async (notificationId: string) => {
        try {
            await update(`notification/${notificationId}`, { read: true });
        } catch (error) {
            console.error("Error marking notification as seen:", error);
        }
    };
    if (pageLoading) {
        return <PageLoading />;
    }

    return (
        <>
            <SinglePostHeader title='Notification' />
            <div className="page-content min-vh-100">
                <div className="content-inner pt-0">
                    <div className="container bottom-content">

                        <ul className="dz-list message-list">
                            <li className="flex-column">
                                {notifications.map((li: any, i: number) => {
                                    if (currentUserId == li?.creator?._id) {
                                        return;
                                    }
                                    return (
                                        <a
                                            key={i}
                                            className="py-2"                                            
                                        >
                                            <div className={`${li?.user?.is_active ? 'media' : ''} media-50`}>
                                                <img
                                                    className="rounded"
                                                    src={formatResourceURL(li?.creator?.profile_img)}
                                                    onError={handleProfileImageError}
                                                    alt="image"
                                                />
                                            </div>
                                            <div className="media-content">
                                                <div>
                                                    <h6 className="name">{getName(li.creator)}</h6>
                                                    <p
                                                        className="my-1"
                                                        style={{
                                                            maxWidth: "40vw",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            fontSize: '17px'
                                                        }}
                                                    >
                                                        {li.description ?? "No messages"}
                                                    </p>
                                                    <div
                                                        className="message-time"
                                                        style={{ paddingBottom: "10px" }}
                                                    >
                                                        {getDateAndTime(li.createdAt)}
                                                    </div>
                                                </div>
                                                {/* <p style={{ marginLeft: '8px', color: li.read ? 'blue' : 'black' }}>{'  ✔✔'}</p> */}
                                            </div>
                                        </a>
                                    );
                                })}
                            </li>
                        </ul>

                    </div>
                </div>
            </div>

            <ShareModal />
        </>
    );
}
