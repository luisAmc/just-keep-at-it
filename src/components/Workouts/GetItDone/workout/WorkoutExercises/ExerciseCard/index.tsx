import { CardHeader } from './CardHeader';
import { CardBody } from './CardBody';

export function ExerciseCard() {
    return (
        <div className="rounded-lg bg-brand-100 p-4">
            <CardHeader />
            <CardBody />
        </div>
    );
}
