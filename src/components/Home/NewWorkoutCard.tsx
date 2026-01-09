import { formatDate } from '~/utils/transforms';
import { MountainsSVG } from './MountainsSVG';
import { useSlideOver } from '../shared/SlideOver';
import { NewWorkoutSlideOver } from './NewWorkoutSlideOver';
import { ArrowRight } from 'lucide-react';

export function NewWorkoutCard() {
    const newWorkoutSlideOver = useSlideOver();

    return (
        <>
            <div className="from-secondary to-muted relative flex h-52 flex-col overflow-hidden rounded-lg bg-linear-to-b shadow-sm">
                <MountainsSVG />

                <div className="relative h-full w-full px-6 py-8">
                    <div className=" ">
                        <div className="text-3xl font-semibold tracking-tight">
                            ¿Una nueva rútina?
                        </div>

                        <div className="font-medium capitalize">
                            {formatDate(new Date(), 'EEEE, dd MMMM')}
                        </div>
                    </div>

                    <div className="absolute right-8 bottom-8">
                        <button
                            className="text-white inline-flex items-center gap-x-2 font-medium"
                            onClick={newWorkoutSlideOver.open}
                        >
                            <span className="text-xl">Comenzar</span>
                            <ArrowRight className="size-6" />
                        </button>
                    </div>
                </div>
            </div>

            <NewWorkoutSlideOver {...newWorkoutSlideOver.props} />
        </>
    );
}
