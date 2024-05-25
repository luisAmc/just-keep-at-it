import { TrashIcon } from '@heroicons/react/24/outline';
import { ExerciseType } from '@prisma/client';
import { useFormContext } from 'react-hook-form';
import { Button } from '~/components/shared/Button';
import { NumberInput } from '~/components/shared/NumberInput';
import { useWorkoutExercise } from './useWorkoutExercise';

interface WorkoutExerciseSetProps {
    name: string;
    setIndex: number;
    onRemove(): void;
}

export function WorkoutExerciseSet({
    name,
    setIndex,
    onRemove,
}: WorkoutExerciseSetProps) {
    const { type } = useWorkoutExercise();

    return (
        <div className="flex justify-between py-2">
            <div className="flex items-center gap-x-2">
                {
                    {
                        [ExerciseType.AEROBIC]: <Aerobic name={name} />,
                        [ExerciseType.STRENGTH]: <Strength name={name} />,
                    }[type]
                }
            </div>

            <div className="flex gap-x-2">
                <LastSession setIndex={setIndex} />

                <Button size="icon" variant="ghost" onClick={onRemove}>
                    <TrashIcon className="size-5" />
                </Button>
            </div>
        </div>
    );
}

interface AerobicProps {
    name: string;
}

function Aerobic({ name }: AerobicProps) {
    const form = useFormContext();

    return (
        <>
            <NumberInput {...form.register(`${name}.mins`)} label="mins" />
            <NumberInput {...form.register(`${name}.distance`)} label="dist" />
            <NumberInput {...form.register(`${name}.kcal`)} label="kcal" />
        </>
    );
}

interface StrengthProps {
    name: string;
}

function Strength({ name }: StrengthProps) {
    const form = useFormContext();

    return (
        <>
            <NumberInput {...form.register(`${name}.lbs`)} label="lbs" />
            <NumberInput {...form.register(`${name}.reps`)} label="reps" />
        </>
    );
}

function LastSession({ setIndex }: { setIndex: number }) {
    const { formName, type, lastSession } = useWorkoutExercise();

    if (!lastSession) {
        return null;
    }

    const lastSessionSet = lastSession.sets[setIndex];

    if (!lastSessionSet) {
        return null;
    }

    const form = useFormContext();

    function handleClick() {
        form.setValue(`${formName}.sets.${setIndex}.lbs`, lastSessionSet.lbs);
        form.setValue(`${formName}.sets.${setIndex}.reps`, lastSessionSet.reps);
    }

    return (
        <div className="flex justify-end">
            <Button variant="ghost" onClick={handleClick}>
                {type === ExerciseType.STRENGTH ? (
                    <>
                        <span>
                            <span className="text-sm">
                                {lastSessionSet.lbs}
                            </span>
                            <span className="text-xs">lbs</span>
                        </span>

                        <span className="text-sm text-slate-500">x</span>

                        <span>
                            <span className="text-sm">
                                {lastSessionSet.reps}
                            </span>
                            <span className="text-xs">reps</span>
                        </span>
                    </>
                ) : (
                    <>
                        {/* <span>
                            <span className="text-sm">
                                {lastSessionSet.mins}
                            </span>
                            <span className="text-xs">m</span>
                        </span>

                        <span className="text-sm text-slate-500">x</span>

                        <span>
                            <span className="text-sm">
                                {lastSessionSet.distance}
                            </span>
                            <span className="text-xs">d</span>
                        </span>

                        <span className="text-sm text-slate-500">x</span>

                        <span>
                            <span className="text-sm">
                                {lastSessionSet.kcal}
                            </span>
                            <span className="text-xs">kc</span>
                        </span> */}
                    </>
                )}
            </Button>
        </div>
    );
}
