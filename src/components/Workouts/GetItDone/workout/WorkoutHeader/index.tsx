import { Button } from '~/components/shared/Button';
import { EditNameDrawer } from './EditNameDrawer';
import { ArrowLeftIcon } from 'lucide-react';
import { DeleteDrawer } from './DeleteDrawer';

export function WorkoutHeader() {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
                <Button href="/" variant="ghost" size="icon">
                    <ArrowLeftIcon className="size-5 " />
                </Button>

                <EditNameDrawer />
            </div>

            <DeleteDrawer />
        </div>
    );
}
