import { User } from "@/utils/constants";
import { Children, createContext, ReactNode, useState } from "react";

interface UserContextType{
    user: User,
    setUser: (user: User) => void
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: ()=>{}
})

export const UserContextProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User|null>(null);

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}