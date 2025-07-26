import { useTheme } from '~/contexts/useTheme';
import { Button } from './shared/Button';
import { Modal, ModalProps } from './shared/Modal';

type ThemeSwitcherModalProps = Omit<ModalProps, 'title' | 'children'>;

export function ThemeSwitcherModal({ open, onClose }: ThemeSwitcherModalProps) {
    const { setTheme } = useTheme();

    return (
        <Modal title="Cambiar paleta de colores" open={open} onClose={onClose}>
            <div className="flex flex-col gap-y-1">
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
            </div>
        </Modal>
    );
}
