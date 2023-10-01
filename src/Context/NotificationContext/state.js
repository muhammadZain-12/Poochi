import React, { useState } from "react"
import NotificationContext from "./context"

const NotificationState = (prop) => {



    const [notification, setNotification] = useState("")
    const [unseenNotification, setUnseenNotifications] = useState(null)


    return (
        <NotificationContext.Provider value={{ notification, setNotification, unseenNotification, setUnseenNotifications }} >
            {prop.children}
        </NotificationContext.Provider>
    )



}

export default NotificationState