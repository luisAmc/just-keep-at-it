import { Button } from '~/components/shared/Button';
import { EditNameDrawer } from './EditNameDrawer';
import { DeleteDrawer } from './DeleteDrawer';
import { ReorderExercisesDrawer } from './ReorderExercisesDrawer';
import { ChevronLeftIcon } from 'lucide-react';

export function WorkoutHeader() {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
                <Button href="/" variant="ghost" size="icon">
                    <ChevronLeftIcon className="size-5" />
                </Button>

                <EditNameDrawer />
            </div>

            <div className="space-x-2">
                <ReorderExercisesDrawer />

                <DeleteDrawer />
            </div>
        </div>
    );
}
