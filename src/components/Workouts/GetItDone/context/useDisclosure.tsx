import { createContext, type ReactNode, useContext, useState } from 'react';

interface DisclosureContextType {
    isOpen: (index: number) => boolean;
    toggle: (index: number) => void;
    openNext: (index: number) => void;
    swapOpen: (from: number, to: number) => void;
}

const DisclosureContext = createContext<DisclosureContextType | undefined>(
    undefined,
);

interface DisclosureProviderProps {
    children: ReactNode;
}

export function DisclosureProvider({ children }: DisclosureProviderProps) {
    const [openedDisclosures, setOpenedDisclosures] = useState<Array<number>>([
        0,
    ]);

    function isOpen(index: number) {
        return openedDisclosures.includes(index);
    }

    function toggle(index: number) {
        const isOpen = openedDisclosures.includes(index);

        if (!isOpen) {
            setOpenedDisclosures([...openedDisclosures, index]);
        } else {
            const updatedOpenedDisclosures = openedDisclosures.filter(
                (openedIndex) => openedIndex !== index,
            );

            setOpenedDisclosures(updatedOpenedDisclosures);
        }
    }

    function openNext(index: number) {
        const updatedOpenedDisclosures = openedDisclosures.filter(
            (openedIndex) => openedIndex !== index,
        );

        setOpenedDisclosures([...updatedOpenedDisclosures, index + 1]);
    }

    function swapOpen(from: number, to: number) {
        const updatedOpenedDisclosures = openedDisclosures.filter(
            (openedIndex) => openedIndex !== from,
        );

        setOpenedDisclosures([...updatedOpenedDisclosures, to]);
    }

    return (
        <DisclosureContext.Provider
            value={{ isOpen, toggle, openNext, swapOpen }}
        >
            {children}
        </DisclosureContext.Provider>
    );
}

export function useDisclosure() {
    const context = useContext(DisclosureContext);

    if (!context) {
        throw new Error(
            '`useDisclosure` can only be use inside a WorkoutExercises component.',
        );
    }

    return context;
}
