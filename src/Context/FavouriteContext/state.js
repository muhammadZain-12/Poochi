import React, { useState } from "react"
import FavouriteSitterContext from "./context"


const FavouriteSittersState = (prop) => {



    const [favouriteSitters, setFavouriteSitters] = useState([])


    return (
        <FavouriteSitterContext.Provider value={{ favouriteSitters, setFavouriteSitters }} >
            {prop.children}
        </FavouriteSitterContext.Provider>
    )



}

export default FavouriteSittersState