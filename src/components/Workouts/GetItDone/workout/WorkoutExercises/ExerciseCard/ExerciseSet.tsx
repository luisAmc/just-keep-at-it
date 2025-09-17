import { Button } from '~/components/shared/Button';
import { ExerciseType } from '@prisma/client';
import { NumberInput } from '~/components/shared/NumberInput';
import { useFormContext } from 'react-hook-form';
import { Trash2Icon } from 'lucide-react';
import { useWorkoutExercise } from '../../../context/useWorkoutExercise';

interface ExerciseSetProps {
    name: string;
    setIdx: number;
    onRemove(): void;
}

export function ExerciseSet({ name, setIdx, onRemove }: ExerciseSetProps) {
    const { type } = useWorkoutExercise();

    return (
        <div className="flex justify-between py-2">
            <div className="flex space-x-2">
                <span className="text-brand-600 mt-2 ml-2 text-xs font-medium">
                    <span>S{setIdx + 1}</span>
                </span>

                <div className="flex items-center gap-x-2">
                    {
                        {
                            [ExerciseType.AEROBIC]: <Aerobic name={name} />,
                            [ExerciseType.STRENGTH]: <Strength name={name} />,
                        }[type]
                    }
                </div>
            </div>
            <div className="flex gap-x-2">
                <LastSession setIndex={setIdx} />

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={onRemove}
                    className="mt-1"
                >
                    <Trash2Icon className="size-5" />
                </Button>
            </div>
        </div>
    );
}

function Aerobic({ name }: { name: string }) {
    const form = useFormContext();

    return (
        <>
            <NumberInput
                {...form.register(`${name}.mins`, { valueAsNumber: true })}
                label="mins"
            />
            <NumberInput
                {...form.register(`${name}.distance`, { valueAsNumber: true })}
                label="dist"
            />
            <NumberInput
                {...form.register(`${name}.kcal`, { valueAsNumber: true })}
                label="kcal"
            />
        </>
    );
}

function Strength({ name }: { name: string }) {
    const form = useFormContext();

    return (
        <>
            <NumberInput
                {...form.register(`${name}.lbs`, { valueAsNumber: true })}
                label="lbs"
            />
            <NumberInput
                {...form.register(`${name}.reps`, { valueAsNumber: true })}
                label="reps"
            />
        </>
    );
}

function LastSession({ setIndex }: { setIndex: number }) {
    const form = useFormContext();
    const { fieldName, type, lastSession } = useWorkoutExercise();

    if (!lastSession || type === ExerciseType.AEROBIC) {
        return null;
    }

    const lastSessionSet = lastSession.sets[setIndex];

    if (!lastSessionSet) {
        return null;
    }

    function handleClick() {
        form.setValue(`${fieldName}.sets.${setIndex}.lbs`, lastSessionSet.lbs);
        form.setValue(
            `${fieldName}.sets.${setIndex}.reps`,
            lastSessionSet.reps,
        );
    }

    return (
        <div className="flex justify-end">
            <Button variant="ghost" onClick={handleClick}>
                {type === ExerciseType.STRENGTH && (
                    <>
                        <span>
                            <span className="text-sm">
                                {lastSessionSet.lbs}
                            </span>
                            <span className="text-xs">lbs</span>
                        </span>

                        <span className="text-brand-300 text-sm">x</span>

                        <span>
                            <span className="text-sm">
                                {lastSessionSet.reps}
                            </span>
                            <span className="text-xs">reps</span>
                        </span>
                    </>
                )}

                {/* {type === ExerciseType.AEROBIC && (
                    <>
                        <span>
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
                            <span className="text-xs">k</span>
                        </span>
                    </>
                )} */}
            </Button>
        </div>
    );
}
