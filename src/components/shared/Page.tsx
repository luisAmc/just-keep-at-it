import { type ReactNode } from 'react';

interface PageProps {
    children: ReactNode;
}

export function Page({ children }: PageProps) {
    return (
        <div className="mx-auto w-full max-w-xl px-2 pb-4">
            <div className="flex flex-col gap-y-4">{children}</div>
        </div>
    );
}
