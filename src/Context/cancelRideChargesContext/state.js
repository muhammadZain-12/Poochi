import React, { useState } from "react"
import CancelChargesContext from "./context"
const CancelChargesState = (prop) => {



    const [cancelCharges, setCancelCharges] = useState("")


    const [scheduleCancelCharges, setScheduleCancelCharges] = useState("")


    return (
        <CancelChargesContext.Provider value={{ cancelCharges, setCancelCharges, scheduleCancelCharges, setScheduleCancelCharges }} >
            {prop.children}
        </CancelChargesContext.Provider>
    )



}

export default CancelChargesState