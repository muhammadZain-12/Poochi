import React, { useState } from "react"
import BannerContext from "./context"


const BannerState = (prop) => {



    const [banners, setBanners] = useState([])


    return (
        <BannerContext.Provider value={{ banners, setBanners }} >
            {prop.children}
        </BannerContext.Provider>
    )



}

export default BannerState