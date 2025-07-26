import {
    type ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

interface ThemeContextType {
    theme: string;
    setTheme(theme: string): void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, _setTheme] = useState('default');

    useEffect(() => {
        const prevSelectedTheme = localStorage.getItem('theme');

        if (prevSelectedTheme) {
            _setTheme(prevSelectedTheme);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== undefined) {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [theme]);

    function setTheme(newTheme: string) {
        _setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    const context: ThemeContextType = {
        theme: theme,
        setTheme: setTheme,
    };

    return (
        <ThemeContext.Provider value={context}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            '`useTheme` can only be use inside a ThemeProvider component.',
        );
    }

    return context;
}
