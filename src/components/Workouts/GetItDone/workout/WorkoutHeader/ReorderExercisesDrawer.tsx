import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { Button } from '~/components/shared/Button';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { useEffect, useState } from 'react';
import { useExercises } from '~/contexts/useExercises';
import { useWorkout } from '../../context/useWorkout';
import { useFormContext, useWatch } from 'react-hook-form';
import { ArrowUpDownIcon, CheckIcon } from 'lucide-react';

export function ReorderExercisesDrawer() {
    const reorderModal = useDrawer();

    const form = useFormContext();

    const { workoutExercisesFieldArray, workoutExerciseCount } = useWorkout();

    const watchedWorkoutExercisesFieldArray = useWatch({
        control: form.control,
        name: 'workoutExercises',
    });

    const [items, setItems] = useState<
        Array<{ id: string; exerciseId: string }>
    >([]);

    useEffect(() => {
        if (!Array.isArray(watchedWorkoutExercisesFieldArray)) {
            return;
        }

        setItems(
            watchedWorkoutExercisesFieldArray.map((workoutExercise, index) => {
                const exerciseId = (workoutExercise as any).exerciseId;
                const id = workoutExercise.id + '-' + index + '-' + exerciseId;

                return {
                    id: id,
                    exerciseId: exerciseId,
                };
            }),
        );
    }, [JSON.stringify(watchedWorkoutExercisesFieldArray)]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over !== null && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.id === active.id,
                );
                const newIndex = items.findIndex((item) => item.id === over.id);

                workoutExercisesFieldArray.move(oldIndex, newIndex);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <>
            <Button
                disabled={workoutExerciseCount < 2}
                variant="secondary"
                className="bg-gray-200"
                size="icon"
                onClick={reorderModal.open}
            >
                <ArrowUpDownIcon className="size-5" />
            </Button>

            <Drawer
                title="Reordenar"
                dismissable={false}
                {...reorderModal.props}
            >
                <div className="space-y-2">
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={items}>
                            {items.map((item) => (
                                <SortableCard
                                    key={item.id}
                                    workoutExercise={item}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>

                <Button
                    variant="secondary"
                    className="bg-gray-200"
                    onClick={reorderModal.close}
                >
                    <CheckIcon className="mr-1 size-4" />
                    <span>Listo</span>
                </Button>
            </Drawer>
        </>
    );
}

interface SortableCardProps {
    workoutExercise: {
        id: string;
        exerciseId: string;
    };
}

function SortableCard({ workoutExercise }: SortableCardProps) {
    const { getExerciseById } = useExercises();

    const exercise = getExerciseById(workoutExercise.exerciseId)!;

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: workoutExercise.id,
            transition: {
                duration: 150,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            },
        });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="select-none rounded-md bg-brand-100 px-4 py-4 text-sm font-medium"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            {exercise.name}
        </div>
    );
}
