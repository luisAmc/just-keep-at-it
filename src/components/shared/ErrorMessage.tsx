interface Props {
    title: string;
    error?: string;
}

export function ErrorMessage({ title, error }: Props) {
    if (!error) return null;

    return (
        <div className="border-destructive-foreground border-opacity-50 bg-destructive space-y-1 rounded-md border-2 p-4">
            {title && (
                <h3 className="text-destructive-foreground text-sm font-medium">
                    {title}
                </h3>
            )}
            <div className="text-destructive-foreground text-sm">{error}</div>
        </div>
    );
}
