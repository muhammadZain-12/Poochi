import React, { useState } from "react"
import LoginContext from "./context"
import PetContext from "./context"

const PetsState = (prop) => {


    const [pets, setPets] = useState([])


    return (
        <PetContext.Provider value={{ pets, setPets }} >
            {prop.children}
        </PetContext.Provider>
    )



}

export default PetsState