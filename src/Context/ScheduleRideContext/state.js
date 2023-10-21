import React, { useState } from "react"
import ScheduleRideContext from "./context"

const ScheduleRideState = (prop) => {



    const [scheduleData, setScheduleData] = useState([])


    return (
        <ScheduleRideContext.Provider value={{ scheduleData, setScheduleData }} >
            {prop.children}
        </ScheduleRideContext.Provider>
    )



}

export default ScheduleRideState