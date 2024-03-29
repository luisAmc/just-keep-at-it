import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, ReactNode, useState } from 'react';

export function useModal() {
  const [open, setOpen] = useState(false);

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    props: {
      open,
      onClose() {
        setOpen(false);
      }
    }
  };
}

export interface ModalProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-30">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="flex w-full max-w-md transform flex-col space-y-4 rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div
                  className={clsx(
                    'flex items-center',
                    title ? 'justify-between' : 'justify-end'
                  )}
                >
                  {title && (
                    <Dialog.Title as="h3" className="text-xl leading-6">
                      {title}
                    </Dialog.Title>
                  )}
                </div>

                <div className="mt-2">{children}</div>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
