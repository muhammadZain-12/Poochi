import React, { useState } from "react"
import cardDetailsContext from "./context"



const CardDetailsState = (prop) => {



    const [cardDetails, setCardDetails] = useState("")

    return (
        <cardDetailsContext.Provider value={{ cardDetails, setCardDetails }} >
            {prop.children}
        </cardDetailsContext.Provider>
    )



}

export default CardDetailsState