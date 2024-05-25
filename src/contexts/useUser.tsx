import { type ReactNode, createContext, useContext } from 'react';
import { RouterOutputs } from '~/utils/api';

interface UserContextType {
    username: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    viewer: RouterOutputs['user']['viewer'];
    children: ReactNode;
}

export function UserProvider({ viewer, children }: UserProviderProps) {
    const context: UserContextType = {
        username: viewer.username
    };

    return (
        <UserContext.Provider value={context}>{children}</UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error(
            '`useUser` can only be use inside a UserProvider component.'
        );
    }

    return context;
}
