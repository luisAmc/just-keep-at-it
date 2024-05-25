import { Button } from './shared/Button';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const router = useRouter();

    return (
        <div className="relative mx-auto w-full max-w-xl">
            <nav className="sticky top-0 z-10 flex items-center justify-end px-4 pt-4 backdrop-blur">
                <Link
                    href="/"
                    className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-400 to-brand-700 bg-clip-text text-xl font-semibold tracking-tight text-transparent"
                >
                    Just keep at it!
                </Link>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        router.push('/templates');
                    }}
                >
                    <Cog6ToothIcon className="size-6 text-brand-600" />
                </Button>
            </nav>

            <main className="relative">{children}</main>
        </div>
    );
}
