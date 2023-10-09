import React, { useState } from "react"
import ChooseLocationContext from "./context"
const ChooseLocationState = (prop) => {



    const [pickup, setPickup] = useState({})
    const [pickupAddress, setPickupAddress] = useState("")
    const [dropoff, setDropoff] = useState({})
    const [dropoffAddress, setDropoffAddress] = useState("")
    const [returnPickup, setReturnPickup] = useState({})
    const [returnPickupAddress, setReturnPickupAddress] = useState("")
    const [returnDropoff, setReturnDropoff] = useState({})
    const [returnDropoffAddress, setReturnDropoffAddress] = useState("")

    return (
        <ChooseLocationContext.Provider value={{ pickup, setPickup, pickupAddress, setPickupAddress, dropoff, setDropoff, dropoffAddress, setDropoffAddress, returnPickup, returnPickupAddress, setReturnPickup, setReturnPickupAddress, setReturnDropoff, setReturnDropoffAddress, returnDropoff, returnDropoffAddress }} >
            {prop.children}
        </ChooseLocationContext.Provider>
    )



}

export default ChooseLocationState