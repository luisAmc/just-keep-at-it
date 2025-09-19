import { api } from '~/utils/api';
import {
    BookDashedIcon,
    SettingsIcon,
    ListIcon,
    LogOutIcon,
    PaletteIcon,
    XIcon,
} from 'lucide-react';
import { cn } from '~/utils/cn';
import { ThemeSwitcherModal } from './ThemeSwitcherModal';
import { useAuthRedirect } from '~/utils/useAuthRedirect';
import { useEffect, useState, type ReactNode } from 'react';
import { useModal } from './shared/Modal';
import { useRouter } from 'next/router';
import { Drawer, useDrawer } from './shared/Drawer';
import { Button } from './shared/Button';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '~/contexts/useTheme';

interface LayoutProps {
    children: ReactNode;
}

type Action = 'default' | 'change-color';

export function Layout({ children }: LayoutProps) {
    const router = useRouter();

    const authRedirect = useAuthRedirect();

    const themeSwitcherModal = useModal();
    const actionDrawer = useDrawer();
    const { setTheme } = useTheme();

    const [selectedAction, setSelectedAction] = useState<Action>('default');
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
                    'bg-background/90 sticky top-0 z-10 flex items-center justify-between p-4 backdrop-blur-lg',
                    !onTopOfPage && 'shadow-md',
                )}
            >
                <Link
                    href="/"
                    className="from-brand-400 to-brand-700 bg-linear-to-r bg-clip-text text-2xl font-semibold tracking-tight text-transparent"
                >
                    Just keep at it!
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        setSelectedAction('default');
                        actionDrawer.open();
                    }}
                >
                    <SettingsIcon className="text-brand-600 size-6" />
                </Button>

                <Drawer {...actionDrawer.props} onClose={actionDrawer.close}>
                    <AnimatePresence mode="wait">
                        {selectedAction === 'default' && (
                            <div
                                key="default"
                                className="flex flex-col gap-y-1"
                            >
                                <Button
                                    variant="muted"
                                    className="h-12 justify-start"
                                    onClick={() => {
                                        router.push('/exercises');
                                        actionDrawer.close();
                                    }}
                                >
                                    <ListIcon className="mr-1 size-4" />
                                    <span>Ejercicios</span>
                                </Button>

                                <Button
                                    variant="muted"
                                    className="h-12 justify-start"
                                    onClick={() => {
                                        router.push('/templates');
                                        actionDrawer.close();
                                    }}
                                >
                                    <BookDashedIcon className="mr-1 size-4" />
                                    <span>Bocetos</span>
                                </Button>

                                <Button
                                    variant="muted"
                                    className="h-12 justify-start"
                                    onClick={() =>
                                        setSelectedAction('change-color')
                                    }
                                >
                                    <PaletteIcon className="mr-1 size-4" />
                                    <span>Cambiar color</span>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="h-12 justify-start text-red-600"
                                    onClick={() => logout.mutateAsync()}
                                >
                                    <LogOutIcon className="mr-1 size-4" />
                                    <span>Cerrar sesión</span>
                                </Button>
                            </div>
                        )}

                        {selectedAction === 'change-color' && (
                            <motion.div
                                key="change-color"
                                className="flex flex-col gap-y-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 1 }}
                            >
                                <Button
                                    size="lg"
                                    className="justify-start bg-teal-300 text-teal-900 hover:bg-teal-300/80"
                                    onClick={() => setTheme('default')}
                                >
                                    <span className="mr-1 size-4 rounded-full bg-teal-500"></span>
                                    <span>Verde azulado</span>
                                </Button>

                                <Button
                                    size="lg"
                                    className="justify-start bg-gray-300 text-gray-900 hover:bg-gray-300/80"
                                    onClick={() => setTheme('gray')}
                                >
                                    <span className="mr-1 size-4 rounded-full bg-gray-500"></span>
                                    <span>Gris</span>
                                </Button>

                                <Button
                                    size="lg"
                                    className="justify-start bg-sky-300 text-sky-900 hover:bg-sky-300/80"
                                    onClick={() => setTheme('sky')}
                                >
                                    <span className="mr-1 size-4 rounded-full bg-sky-500"></span>
                                    <span>Celeste</span>
                                </Button>

                                <Button
                                    size="lg"
                                    className="justify-start bg-rose-300 text-rose-900 hover:bg-rose-300/80"
                                    onClick={() => setTheme('rose')}
                                >
                                    <span className="mr-1 size-4 rounded-full bg-rose-500"></span>
                                    <span>Rosa</span>
                                </Button>
                            </motion.div>
                        )}

                        {selectedAction !== 'default' && (
                            <Button
                                variant="secondary"
                                onClick={actionDrawer.close}
                            >
                                <XIcon className="mr-1 size-4" />
                                <span>Cerrar</span>
                            </Button>
                        )}
                    </AnimatePresence>
                </Drawer>

                <ThemeSwitcherModal {...themeSwitcherModal.props} />
            </nav>

            <main className="relative">{children}</main>
        </div>
    );
}
