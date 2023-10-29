import React, { useState } from "react"
import RadiusContext from "./context"

const RadiusState = (prop) => {



    const [radius, setRadius] = useState("")


    return (
        <RadiusContext.Provider value={{ radius, setRadius }} >
            {prop.children}
        </RadiusContext.Provider>
    )



}

export default RadiusState