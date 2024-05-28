import { Button } from '~/components/shared/Button';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { WorkoutExercise } from './WorkoutExercise';
import {
    AddChangeExerciseSlideOver,
    useAddChangeExerciseSlideOver,
} from './AddChangeExerciseSlideOver';
import {
    MoveExerciseActionOption,
    WorkoutExerciseProvider,
} from './useWorkoutExercise';
import {
    WorkoutExerciseHistorySlideOver,
    useExerciseHistorySlideOver,
} from './ExerciseHistorySlideOver';

const FIELD_ARRAY_NAME = 'workoutExercises';

export function WorkoutExercisesList() {
    const [animateParent] = useAutoAnimate<HTMLDivElement>();

    const form = useFormContext();

    const workoutExercisesFieldArray = useFieldArray({
        control: form.control,
        name: FIELD_ARRAY_NAME,
    });

    const maxIndex = workoutExercisesFieldArray.fields.length - 1;

    const addChangeExerciseSlideOver = useAddChangeExerciseSlideOver();
    const historySlideOver = useExerciseHistorySlideOver();

    function handleAdd(exerciseId: string) {
        workoutExercisesFieldArray.append({
            exerciseId,
            sets: [{ mins: '', distance: '', kcal: '', reps: '', lbs: '' }],
            notes: '',
        });
    }

    function handleChange(exerciseId: string, exerciseIndex: number) {
        workoutExercisesFieldArray.remove(exerciseIndex);
        workoutExercisesFieldArray.insert(exerciseIndex, {
            exerciseId,
            sets: [{ mins: '', distance: '', kcal: '', reps: '', lbs: '' }],
            notes: '',
        });
    }

    function handleRemove(index: number) {
        workoutExercisesFieldArray.remove(index);
    }

    function handleMove(action: MoveExerciseActionOption, index: number) {
        if (action === 'first') {
            workoutExercisesFieldArray.move(index, 0);
        } else if (action === 'last') {
            workoutExercisesFieldArray.move(index, maxIndex);
        } else {
            const moveStep = action === 'up' ? -1 : 1;
            workoutExercisesFieldArray.move(index, index + moveStep);
        }
    }

    return (
        <>
            <div ref={animateParent} className="space-y-2">
                {workoutExercisesFieldArray.fields.length > 0 ? (
                    workoutExercisesFieldArray.fields.map(
                        (workoutExercise, idx) => (
                            <div key={workoutExercise.id}>
                                <WorkoutExerciseProvider
                                    exerciseId={
                                        (workoutExercise as any).exerciseId
                                    }
                                    formName={`${FIELD_ARRAY_NAME}.${idx}`}
                                    isFirst={idx === 0}
                                    isLast={idx === maxIndex}
                                    onRemove={() => handleRemove(idx)}
                                    onMove={(moveAction) =>
                                        handleMove(moveAction, idx)
                                    }
                                    onChange={() =>
                                        addChangeExerciseSlideOver.open({
                                            type: 'change',
                                            changeIndex: idx,
                                        })
                                    }
                                    onHistory={() =>
                                        historySlideOver.open(
                                            (workoutExercise as any).exerciseId,
                                        )
                                    }
                                >
                                    <WorkoutExercise />
                                </WorkoutExerciseProvider>
                            </div>
                        ),
                    )
                ) : (
                    <div className="flex flex-col items-center space-y-2 rounded-md bg-brand-100 p-8 text-brand-500">
                        <SparklesIcon className="h-10 w-10" />

                        <p className="text-sm font-semibold">
                            La rútina no tiene ejercicios...
                        </p>
                    </div>
                )}
            </div>

            <Button
                variant="outline"
                className="w-full"
                onClick={() => addChangeExerciseSlideOver.open({ type: 'add' })}
            >
                <PlusIcon className="mr-1 size-4" />
                <span>Añadir otro ejercicio</span>
            </Button>

            <AddChangeExerciseSlideOver
                onAdd={handleAdd}
                onChange={handleChange}
                {...addChangeExerciseSlideOver.props}
            />

            <WorkoutExerciseHistorySlideOver {...historySlideOver.props} />
        </>
    );
}
