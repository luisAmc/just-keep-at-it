import { createContext, type ReactNode, useContext, useState } from 'react';

interface DisclosureContextType {
    isOpen: (index: number) => boolean;
    open: (indexes: number[]) => void;
    toggle: (index: number) => void;
    openNext: (index: number) => void;
    swapOpen: (from: number, to: number) => void;
}

const DisclosureContext = createContext<DisclosureContextType | undefined>(
    undefined,
);

interface DisclosureProviderProps {
    initialCount: number;
    children: ReactNode;
}

export function DisclosureProvider({
    initialCount,
    children,
}: DisclosureProviderProps) {
    const [openedDisclosures, setOpenedDisclosures] = useState<Set<number>>(
        () => new Set(Array.from({ length: initialCount }).map((_, i) => i)),
    );

    function isOpen(index: number) {
        return openedDisclosures.has(index);
    }

    function open(indexes: number[]) {
        setOpenedDisclosures(new Set([...openedDisclosures, ...indexes]));
    }

    function toggle(index: number) {
        const isOpen = openedDisclosures.has(index);

        if (!isOpen) {
            setOpenedDisclosures(new Set([...openedDisclosures, index]));
        } else {
            const updatedOpenedDisclosures = openedDisclosures
                .values()
                .filter((openedIndex) => openedIndex !== index);

            setOpenedDisclosures(new Set(updatedOpenedDisclosures));
        }
    }

    function openNext(index: number) {
        const updatedOpenedDisclosures = openedDisclosures
            .values()
            .filter((openedIndex) => openedIndex !== index);

        setOpenedDisclosures(new Set([...updatedOpenedDisclosures, index + 1]));
    }

    function swapOpen(from: number, to: number) {
        const updatedOpenedDisclosures = openedDisclosures
            .values()
            .filter((openedIndex) => openedIndex !== from);

        setOpenedDisclosures(new Set([...updatedOpenedDisclosures, to]));
    }

    return (
        <DisclosureContext.Provider
            value={{ isOpen, open, toggle, openNext, swapOpen }}
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
