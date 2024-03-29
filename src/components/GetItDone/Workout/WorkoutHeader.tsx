import { gql, useMutation } from '@apollo/client';
import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { Button, buttonStyles } from 'src/components/shared/Button';
import { ConfirmationModal } from 'src/components/shared/ConfirmationModal';
import { Heading } from 'src/components/shared/Heading';
import { useModal } from 'src/components/shared/Modal';
import { EditNameModal } from './EditNameModal';
import { useWorkoutContext } from './WorkoutContext';
import { twMerge } from 'tailwind-merge';
import {
  WorkoutHeaderDeleteMutation,
  WorkoutHeaderDeleteMutationVariables
} from './__generated__/WorkoutHeader.generated';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export function WorkoutHeader() {
  const router = useRouter();

  const { name, workoutId } = useWorkoutContext();
  const editNameModal = useModal();
  const deleteModal = useModal();

  const [deleteWorkout] = useMutation<
    WorkoutHeaderDeleteMutation,
    WorkoutHeaderDeleteMutationVariables
  >(
    gql`
      mutation WorkoutHeaderDeleteMutation($workoutId: ID!) {
        deleteWorkout(workoutId: $workoutId) {
          id
        }
      }
    `,
    {
      update(cache) {
        const deletedWorkoutId = cache.identify({
          __typename: 'Workout',
          id: workoutId
        });

        cache.evict({ id: deletedWorkoutId });
        cache.gc();
      },
      onCompleted() {
        router.push('/');
      }
    }
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-1">
        <div className="grid place-items-center">
          <Button
            href="/"
            className={twMerge(
              clsx(buttonStyles(), 'inline-block rounded-full p-0.5')
            )}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={editNameModal.open}>
          <Heading size="2xl">{name}</Heading>
        </Button>

        <EditNameModal {...editNameModal.props} />
      </div>

      <div>
        <Button
          onClick={deleteModal.open}
          className="rounded-full bg-rose-500 p-1 text-rose-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white"
        >
          <TrashIcon className="h-5 w-5" />
        </Button>

        <ConfirmationModal
          {...deleteModal.props}
          onConfirm={() => {
            toast.promise(
              deleteWorkout({
                variables: {
                  workoutId: workoutId
                }
              }),
              {
                loading: 'Borrando rútina...',
                success: '¡Rútina borrada!',
                error: 'No se pudo borrar la rútina.'
              }
            );
          }}
        >
          ¿Está seguro de borrar la rútina?
        </ConfirmationModal>
      </div>
    </div>
  );
}
