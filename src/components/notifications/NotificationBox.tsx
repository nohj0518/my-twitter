import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { NotificationProps } from "pages/notifications";
import { useNavigate } from "react-router-dom";

import style from "./Notifications.module.scss";

export default function NotificationBox({
  notification,
}: {
  notification: NotificationProps;
}) {
  const navigate = useNavigate();
  const onClickNotification = async (url: string) => {
    // isRead 업데이트
    const ref = doc(db, "notifications", notification.id);
    await updateDoc(ref, {
      isRead: true,
    });

    navigate(url);
  };
  return (
    <>
      <div className={style.notification} key={notification.id}>
        <div onClick={() => onClickNotification(notification?.url)}>
          <div className={style.notification__flex}>
            <div className={style.notification__createdAt}>
              {notification.createdAt}
            </div>
            {notification?.isRead === false && (
              <div className={style.notification__unread} />
            )}
          </div>
          <div className="">{notification.content}</div>
        </div>
      </div>
    </>
  );
}
