import { api } from '~/utils/api';
import {
    BookDashedIcon,
    SettingsIcon,
    ListIcon,
    LogOutIcon,
    PaletteIcon,
} from 'lucide-react';
import { cn } from '~/utils/cn';
import { Dropdown, DropdownGroup, DropdownItem } from './shared/Dropdown';
import { ThemeSwitcherModal } from './ThemeSwitcherModal';
import { useAuthRedirect } from '~/utils/useAuthRedirect';
import { useEffect, useState, type ReactNode } from 'react';
import { useModal } from './shared/Modal';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const router = useRouter();
    const authRedirect = useAuthRedirect();
    const themeSwitcherModal = useModal();
    const [onTopOfPage, setOnTopOfPage] = useState(true);

    useEffect(() => {
        const handler = () => {
            setOnTopOfPage(window.scrollY <= 10);
        };

        window.addEventListener('scroll', handler);

        return () => {
            window.removeEventListener('scroll', handler);
        };
    }, []);

    const logout = api.auth.logout.useMutation({
        onSuccess() {
            authRedirect();
        },
    });

    return (
        <div className="relative mx-auto w-full max-w-xl">
            <nav
                className={cn(
                    'sticky top-0 z-10 flex items-center justify-end bg-background/50 p-4 backdrop-blur-md',
                    !onTopOfPage && 'shadow-md',
                )}
            >
                <Link
                    href="/"
                    className="from-brand-400 to-brand-700 absolute left-1/2 -translate-x-1/2 bg-linear-to-r bg-clip-text text-2xl font-semibold tracking-tight text-transparent"
                >
                    Just keep at it!
                </Link>

                <Dropdown
                    className="mx-4 border-gray-300 shadow-md"
                    trigger={<SettingsIcon className="text-brand-600 size-6" />}
                >
                    <DropdownGroup>
                        <DropdownItem
                            onSelect={() => router.push('/exercises')}
                        >
                            <ListIcon className="mr-1 size-4" />
                            <span>Ejercicios</span>
                        </DropdownItem>

                        <DropdownItem
                            onSelect={() => router.push('/templates')}
                        >
                            <BookDashedIcon className="mr-1 size-4" />
                            <span>Bocetos</span>
                        </DropdownItem>

                        <DropdownItem onSelect={themeSwitcherModal.open}>
                            <PaletteIcon className="mr-1 size-4" />
                            <span>Cambiar color</span>
                        </DropdownItem>

                        <DropdownItem
                            onSelect={() => logout.mutateAsync()}
                            className="text-red-600"
                        >
                            <LogOutIcon className="mr-1 size-4" />
                            <span>Cerrar sesión</span>
                        </DropdownItem>
                    </DropdownGroup>
                </Dropdown>

                <ThemeSwitcherModal {...themeSwitcherModal.props} />
            </nav>

            <main className="relative">{children}</main>
        </div>
    );
}
