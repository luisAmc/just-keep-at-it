import { Button } from '~/components/shared/Button';
import { EditNameDrawer } from './EditNameDrawer';
import { ArrowLeftIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface WorkoutHeaderProps {
    action: ReactNode;
}
export function WorkoutHeader({ action }: WorkoutHeaderProps) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
                <Button href="/" variant="ghost" size="icon">
                    <ArrowLeftIcon className="size-5 " />
                </Button>

                <EditNameDrawer />
            </div>

            {action}
        </div>
    );
}
