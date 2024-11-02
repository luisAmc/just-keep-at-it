import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { ArrowsUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '~/components/shared/Button';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Drawer, useDrawer } from '~/components/shared/Drawer';
import { useEffect, useState } from 'react';
import { useExercises } from '~/contexts/useExercises';
import { useWorkout } from '../../context/useWorkout';

export function ReorderExercisesDrawer() {
    const reorderModal = useDrawer();

    const { workoutExercisesFieldArray, workoutExerciseCount } = useWorkout();

    const [items, setItems] = useState<
        Array<{ id: string; exerciseId: string }>
    >([]);

    useEffect(() => {
        setItems(
            workoutExercisesFieldArray.fields.map((workoutExercise) => ({
                id: workoutExercise.id,
                exerciseId: (workoutExercise as any).exerciseId,
            })),
        );
    }, [workoutExercisesFieldArray]);

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
                className='bg-gray-200'
                size="icon"
                onClick={reorderModal.open}
            >
                <ArrowsUpDownIcon className="size-5" />
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
                            {items.map((workoutExercises) => (
                                <SortableCard
                                    key={workoutExercises.id}
                                    workoutExercise={workoutExercises}
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

function SortableCard({
    workoutExercise,
}: {
    workoutExercise: { id: string; exerciseId: string };
}) {
    const { getExerciseById } = useExercises();

    const exercise = getExerciseById(workoutExercise.exerciseId)!;

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: workoutExercise.id,
            transition: {
                duration: 150, // milliseconds
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            },
        });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="rounded-md bg-brand-100 px-4 py-4 font-medium text-sm"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            {exercise.name}
        </div>
    );
}
