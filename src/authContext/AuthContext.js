import React, { createContext } from 'react'

const initialState = {
    loading:false
}

export const AuthContextProvider = createContext(initialState)

const AuthContext = ({children}) => {
    const [state1, setState] = React.useState(true);
    const [Leave, setLeave] = React.useState(false);

  return (
   <AuthContextProvider.Provider value={{state1, setState, Leave, setLeave}}>
    {children}
   </AuthContextProvider.Provider>
  )
}

export default AuthContext