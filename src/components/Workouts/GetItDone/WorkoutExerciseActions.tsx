import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowsRightLeftIcon,
    ChevronDoubleDownIcon,
    ChevronDoubleUpIcon,
    EllipsisVerticalIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { useWorkoutExercise } from './useWorkoutExercise';
import {
    Dropdown,
    DropdownGroup,
    DropdownItem,
    DropdownLabel,
} from '~/components/shared/Dropdown';

export function WorkoutExerciseActions() {
    const { isFirst, isLast, onChange, onMove, onRemove } =
        useWorkoutExercise();

    return (
        <Dropdown
            className="mx-4"
            trigger={<EllipsisVerticalIcon className="size-5" />}
        >
            <DropdownLabel>Cambio</DropdownLabel>
            <DropdownGroup>
                <DropdownItem onSelect={onChange}>
                    <ArrowsRightLeftIcon className="mr-1 size-4" />
                    <span>Cambiar ejercicio</span>
                </DropdownItem>
            </DropdownGroup>

            <DropdownLabel>Ubicación</DropdownLabel>
            <DropdownGroup>
                <DropdownItem
                    disabled={isFirst}
                    onSelect={() => onMove('first')}
                >
                    <ChevronDoubleUpIcon className="mr-1 size-4" />
                    <span>Mover al incio</span>
                </DropdownItem>

                <DropdownItem disabled={isFirst} onSelect={() => onMove('up')}>
                    <ArrowUpIcon className="mr-1 size-4" />
                    <span>Mover arriba</span>
                </DropdownItem>

                <DropdownItem disabled={isLast} onSelect={() => onMove('down')}>
                    <ArrowDownIcon className="mr-1 size-4" />
                    <span>Mover abajo</span>
                </DropdownItem>

                <DropdownItem disabled={isLast} onSelect={() => onMove('last')}>
                    <ChevronDoubleDownIcon className="mr-1 size-4" />
                    <span>Mover al final</span>
                </DropdownItem>
            </DropdownGroup>

            <DropdownLabel>Peligro</DropdownLabel>
            <DropdownGroup>
                <DropdownItem onSelect={onRemove} className="text-red-600">
                    <TrashIcon className="mr-1 size-4" />
                    <span>Remover ejercicio</span>
                </DropdownItem>
            </DropdownGroup>
        </Dropdown>
    );
}
