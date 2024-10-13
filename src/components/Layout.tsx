import {
    ArrowRightStartOnRectangleIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    ListBulletIcon,
} from '@heroicons/react/24/outline';
import { type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dropdown, DropdownGroup, DropdownItem } from './shared/Dropdown';
import { api } from '~/utils/api';
import { useAuthRedirect } from '~/utils/useAuthRedirect';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const router = useRouter();
    const authRedirect = useAuthRedirect();

    const logout = api.auth.logout.useMutation({
        onSuccess() {
            authRedirect();
        },
    });

    return (
        <div className="relative mx-auto w-full max-w-xl">
            <nav className="sticky top-0 z-10 flex items-center justify-end bg-brand-50 p-4">
                <Link
                    href="/"
                    className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-400 to-brand-700 bg-clip-text text-2xl font-semibold tracking-tight text-transparent"
                >
                    Just keep at it!
                </Link>
                <Dropdown
                    className="mx-4"
                    trigger={
                        <Cog6ToothIcon className="size-6 text-brand-600" />
                    }
                >
                    <DropdownGroup>
                        <DropdownItem
                            onSelect={() => router.push('/exercises')}
                        >
                            <ListBulletIcon className="mr-1 size-4" />
                            <span>Ejercicios</span>
                        </DropdownItem>

                        <DropdownItem
                            onSelect={() => router.push('/templates')}
                        >
                            <DocumentTextIcon className="mr-1 size-4" />
                            <span>Bocetos</span>
                        </DropdownItem>

                        <DropdownItem
                            onSelect={() => logout.mutateAsync()}
                            className="text-red-600"
                        >
                            <ArrowRightStartOnRectangleIcon className="mr-1 size-4" />
                            <span>Cerrar sesión</span>
                        </DropdownItem>
                    </DropdownGroup>
                </Dropdown>
            </nav>

            <main className="relative">{children}</main>
        </div>
    );
}
