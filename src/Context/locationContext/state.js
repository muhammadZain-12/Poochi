import React, { useState } from "react"
import LocationContext from "./context"
const LocationState = (prop) => {



    const [locationData, setLocationData] = useState({
        currentLocation : "",
        currentAddress : "",
        shortAddress : "",
    })


    return (
        <LocationContext.Provider value={{ locationData, setLocationData }} >
            {prop.children}
        </LocationContext.Provider>
    )



}

export default LocationState