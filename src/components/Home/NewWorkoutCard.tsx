import { formatDate } from '~/utils/transforms';
import { MountainsSVG } from './MountainsSVG';
import { useSlideOver } from '../shared/SlideOver';
import { NewWorkoutSlideOver } from './NewWorkoutSlideOver';
import { ArrowRight } from 'lucide-react';

export function NewWorkoutCard() {
    const newWorkoutSlideOver = useSlideOver();

    return (
        <>
            <div className="relative flex h-52 flex-col overflow-hidden rounded-lg bg-gradient-to-b from-brand-300 to-brand-100 shadow-sm">
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

                    <div className="absolute bottom-8 right-8">
                        <button
                            className="inline-flex items-center gap-x-2 font-medium text-brand-50"
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
