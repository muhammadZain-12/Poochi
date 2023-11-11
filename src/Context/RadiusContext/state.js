import React, { useState } from "react"
import RadiusContext from "./context"

const RadiusState = (prop) => {



    const [radius, setRadius] = useState("")
    const [scheduleRideRadius,setScheduleRideRadius] = useState("")


    return (
        <RadiusContext.Provider value={{ radius, setRadius,scheduleRideRadius,setScheduleRideRadius }} >
            {prop.children}
        </RadiusContext.Provider>
    )



}

export default RadiusState