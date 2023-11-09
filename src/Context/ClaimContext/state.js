import React, { useState } from "react"
import ClaimContext from "./context"


const ClaimState = (prop) => {



    const [claim, setClaim] = useState([])


    return (
        <ClaimContext.Provider value={{ claim, setClaim }} >
            {prop.children}
        </ClaimContext.Provider>
    )



}

export default ClaimState