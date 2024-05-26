import { useWorkoutExercise } from './useWorkoutExercise';
import { Button, buttonVariants } from '~/components/shared/Button';
import { cn } from '~/utils/cn';
import {
    ChevronUpIcon,
    PlusIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { WorkoutExerciseSet } from './WorkoutExerciseSet';
import { WorkoutExerciseActions } from './WorkoutExerciseActions';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { SimpleInput } from '~/components/shared/SimpleInput';

export function WorkoutExercise() {
    const { name, formName, lastSession, type } = useWorkoutExercise();

    const [animateParent] = useAutoAnimate<HTMLDivElement>();

    const form = useFormContext();

    const setsFieldArray = useFieldArray({
        control: form.control,
        name: `${formName}.sets`,
    });

    function handleAddSet() {
        setsFieldArray.append({
            mins: '',
            distance: '',
            kcal: '',
            reps: '',
            lbs: '',
        });
    }

    function handleRemoveSet(index: number) {
        setsFieldArray.remove(index);
    }

    return (
        <div ref={animateParent} className="rounded-xl bg-brand-100 p-4">
            <Disclosure defaultOpen={true}>
                {({ open }) => (
                    <>
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                className="text-wrap text-start text-base"
                            >
                                <span className="text-ellipsis">{name}</span>
                            </Button>

                            <div className="flex items-center">
                                <DisclosureButton
                                    className={buttonVariants({
                                        variant: 'ghost',
                                        className: 'space-x-2 text-base',
                                    })}
                                >
                                    <span className="text-sm">
                                        {setsFieldArray.fields.length} sets
                                    </span>

                                    <ChevronUpIcon
                                        className={cn(
                                            'h-4 w-4',
                                            open && 'rotate-180 transform',
                                        )}
                                    />
                                </DisclosureButton>

                                <WorkoutExerciseActions />
                            </div>
                        </div>

                        <DisclosurePanel className="pt-2">
                            {setsFieldArray.fields.map((field, idx) => (
                                <WorkoutExerciseSet
                                    key={field.id}
                                    setIndex={idx}
                                    name={`${formName}.sets.${idx}`}
                                    onRemove={() => handleRemoveSet(idx)}
                                />
                            ))}

                            {setsFieldArray.fields.length > 0 ? (
                                <>
                                    <Button
                                        variant="dashed"
                                        className="w-full"
                                        onClick={handleAddSet}
                                    >
                                        <PlusIcon className="mr-1 size-4" />
                                        <span>Añadir set</span>
                                    </Button>

                                    <SimpleInput
                                        {...form.register(`${formName}.notes`)}
                                        placeholder="Notas..."
                                        className="border-none bg-transparent "
                                    />

                                    {lastSession?.notes && (
                                        <div className="mt-4 px-2 text-xs">
                                            <span className="font-bold">
                                                Última vez:
                                            </span>

                                            <div className="text-pretty">
                                                {lastSession.notes}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Button
                                    onClick={handleAddSet}
                                    variant="dashed"
                                    className="flex h-20 w-full flex-col border-brand-600"
                                >
                                    <SparklesIcon className="size-6" />
                                    <span className="font-semibold">
                                        Comenzar
                                    </span>
                                </Button>
                            )}
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>
        </div>
    );
}
