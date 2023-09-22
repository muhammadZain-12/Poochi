import React, { useState } from "react"
import BookingContext from "./context"


const BookingState = (prop) => {



    const [bookingData, setBookingData] = useState("")


    return (
        <BookingContext.Provider value={{ bookingData, setBookingData }} >
            {prop.children}
        </BookingContext.Provider>
    )



}

export default BookingState