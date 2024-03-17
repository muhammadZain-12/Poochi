import React, { useState } from "react"
import CancelChargesContext from "./context"
const CancelChargesState = (prop) => {



    const [cancelCharges, setCancelCharges] = useState("")


    const [scheduleCancelCharges, setScheduleCancelCharges] = useState("")

    const [cancelPetSittingCharges,setCancelPetSittingCharges] = useState("")

    const [scheduleCancelPetSittingCharges,setScheduleCancelPetSittingCharges] = useState("")


    return (
        <CancelChargesContext.Provider value={{ cancelCharges, setCancelCharges, scheduleCancelCharges, setScheduleCancelCharges,cancelPetSittingCharges,setCancelPetSittingCharges,
            scheduleCancelPetSittingCharges,setScheduleCancelPetSittingCharges
        }} >
            {prop.children}
        </CancelChargesContext.Provider>
    )



}

export default CancelChargesState