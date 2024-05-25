import { Button } from '~/components/shared/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
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

    function handleAdd(exerciseId: string) {
        workoutExercisesFieldArray.append({ exerciseId, sets: [] });
    }

    function handleChange(exerciseId: string, exerciseIndex: number) {
        workoutExercisesFieldArray.remove(exerciseIndex);
        workoutExercisesFieldArray.insert(exerciseIndex, {
            exerciseId,
            sets: [],
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
                {workoutExercisesFieldArray.fields.map(
                    (workoutExercise, idx) => (
                        <div key={workoutExercise.id}>
                            <WorkoutExerciseProvider
                                exerciseId={(workoutExercise as any).exerciseId}
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
                            >
                                <WorkoutExercise />
                            </WorkoutExerciseProvider>
                        </div>
                    ),
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
        </>
    );
}
