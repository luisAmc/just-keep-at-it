import { CatIcon } from 'lucide-react';

export function EmptyTemplates() {
    return (
        <div className="flex flex-col rounded-lg bg-muted px-4 py-6">
            <div className="flex flex-col items-center space-y-3 rounded-md text-muted-foreground">
                <CatIcon className="size-8" />

                <p className="text-sm font-semibold">
                    No se han creado bocetos...
                </p>
            </div>
        </div>
    );
}
