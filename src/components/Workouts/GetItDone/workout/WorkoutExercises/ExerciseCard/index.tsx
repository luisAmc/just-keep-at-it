import { CardHeader } from './CardHeader';
import { CardBody } from './CardBody';

export function ExerciseCard() {
    return (
        <div className="bg-gid-card rounded-lg p-4">
            <CardHeader />
            <CardBody />
        </div>
    );
}
