import { Button, buttonVariants } from '~/components/shared/Button';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripIcon } from 'lucide-react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { useDisclosure } from '../../context/useDisclosure';
import { useExercises } from '~/contexts/useExercises';
import { useWorkout } from '../../context/useWorkout';

export function ReorderExercises() {
    const { workoutExercisesFieldArray } = useWorkout();
    const { open } = useDisclosure();

    const sensors = useSensors(useSensor(PointerSensor));

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over !== null && active.id !== over.id) {
            const oldIndex = active.data.current?.sortable.index;
            const newIndex = over.data.current?.sortable.index;

            open([oldIndex, newIndex]);

            workoutExercisesFieldArray.move(oldIndex, newIndex);
        }
    }

    return (
        <div className="flex flex-col gap-y-1">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={workoutExercisesFieldArray.fields}>
                    {workoutExercisesFieldArray.fields.map((item) => (
                        <SortableCard
                            key={item.id}
                            workoutExercise={item as any}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
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
            className={buttonVariants({
                variant: 'muted',
                className: 'z-40 h-12',
            })}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                touchAction: 'none',
            }}
        >
            <div className="flex flex-1 items-center justify-between">
                <span>{exercise.name}</span>

                <Button
                    size="icon"
                    variant="ghost"
                    {...attributes}
                    {...listeners}
                >
                    <GripIcon className="size-4" />
                </Button>
            </div>
        </div>
    );
}
