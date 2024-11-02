import { Button } from '~/components/shared/Button';
import { ExerciseType } from '@prisma/client';
import { NumberInput } from '~/components/shared/NumberInput';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useFormContext } from 'react-hook-form';
import { useWorkoutExercise } from '../../context/useWorkoutExercise';

export function ExerciseSet({
    name,
    setIdx,
    onRemove,
}: {
    name: string;
    setIdx: number;
    onRemove(): void;
}) {
    const { type } = useWorkoutExercise();

    return (
        <div className="flex justify-between py-2">
            <div className="flex space-x-2">
                <span className="ml-2 mt-2 text-xs font-medium text-brand-600">
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
                    <TrashIcon className="size-5" />
                </Button>
            </div>
        </div>
    );
}

function Aerobic({ name }: { name: string }) {
    const form = useFormContext();

    return (
        <>
            <NumberInput {...form.register(`${name}.mins`)} label="mins" />
            <NumberInput {...form.register(`${name}.distance`)} label="dist" />
            <NumberInput {...form.register(`${name}.kcal`)} label="kcal" />
        </>
    );
}

function Strength({ name }: { name: string }) {
    const form = useFormContext();

    return (
        <>
            <NumberInput {...form.register(`${name}.lbs`)} label="lbs" />
            <NumberInput {...form.register(`${name}.reps`)} label="reps" />
        </>
    );
}

function LastSession({ setIndex }: { setIndex: number }) {
    const form = useFormContext();
    const { fieldName, type, lastSession } = useWorkoutExercise();

    if (!lastSession) {
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

                        <span className="text-sm text-slate-500">x</span>

                        <span>
                            <span className="text-sm">
                                {lastSessionSet.reps}
                            </span>
                            <span className="text-xs">reps</span>
                        </span>
                    </>
                )}
            </Button>
        </div>
    );
}
