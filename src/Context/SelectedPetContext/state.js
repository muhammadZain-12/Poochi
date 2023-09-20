import React, { useState } from "react"
import SelectedPetContext from "./context"
const SelectedPetState = (prop) => {



    const [selectedPets, setSelectedPets] = useState([])


    return (
        <SelectedPetContext.Provider value={{ selectedPets, setSelectedPets }} >
            {prop.children}
        </SelectedPetContext.Provider>
    )



}

export default SelectedPetState