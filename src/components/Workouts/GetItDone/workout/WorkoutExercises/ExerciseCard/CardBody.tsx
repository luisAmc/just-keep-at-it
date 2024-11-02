import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '~/components/shared/Button';
import { ExerciseSet } from '../ExerciseSet';
import { ArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useWorkoutExercise } from '../../../context/useWorkoutExercise';
import { SimpleTextarea } from '~/components/shared/SimpleInput';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

export function CardBody() {
    const {
        fieldName,
        setsFieldArray: sets,
        isLast,
        isOpen,
        openNext,
    } = useWorkoutExercise();
    const form = useFormContext();

    useEffect(() => {
        if (sets.fields.length === 0) {
            addSet();
        }
    }, []);

    function addSet() {
        sets.append({ mins: 0, distance: 0, kcal: 0, reps: 0, lbs: 0 });
    }

    function removeSet(indexToRemove: number) {
        sets.remove(indexToRemove);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.1, ease: 'easeOut' }}
                >
                    <div className="pt-4">
                        <SimpleTextarea
                            {...form.register(`${fieldName}.notes`)}
                            placeholder="Notas..."
                            className="rounded-md border-none bg-transparent focus:bg-brand-200"
                        />

                        <AnimatePresence>
                            {sets.fields.map((field, idx) => (
                                <motion.div
                                    key={field.id}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                        duration: 0.1,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <ExerciseSet
                                        setIdx={idx}
                                        name={`${fieldName}.sets.${idx}`}
                                        onRemove={() => removeSet(idx)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <div className="grid grid-cols-5 gap-x-2">
                            <Button
                                variant="secondary"
                                className="col-span-4"
                                onClick={addSet}
                            >
                                <PlusIcon className="mr-1 size-4" />
                                <span>Añadir set</span>
                            </Button>

                            <Button
                                disabled={isLast}
                                variant="secondary"
                                className="col-span-1"
                                onClick={openNext}
                            >
                                <ArrowDownIcon className="mr-1 size-4" />
                                <span>Sig.</span>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
