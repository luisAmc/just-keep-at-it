import { SparklesIcon } from '@heroicons/react/24/outline';

export function EmptyTemplates() {
    return (
        <div className="flex flex-col divide-brand-700 rounded-lg bg-brand-50 px-4 py-6">
            <div className="flex flex-col items-center space-y-3 rounded-md text-brand-600">
                <SparklesIcon className="size-8" />
                
                <p className="text-sm font-semibold">
                    No se han creado bocetos...
                </p>
            </div>
        </div>
    );
}
