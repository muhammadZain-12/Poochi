import React, { useState } from "react"
import LoginContext from "./context"

const LoginState = (prop) => {



    const [loginData, setLoginData] = useState("")


    return (
        <LoginContext.Provider value={{ loginData, setLoginData }} >
            {prop.children}
        </LoginContext.Provider>
    )



}

export default LoginState