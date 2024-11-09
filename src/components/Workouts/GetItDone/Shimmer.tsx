import { motion } from 'framer-motion';

export function Shimmer() {
    return (
        <motion.div
            key="before"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="flex flex-col space-y-2 rounded-xl px-2 py-1"
        >
            <Header />

            <OpenCard />

            <CloseCard />

            <div></div>

            <div className="h-11 w-full rounded-md bg-brand-200"></div>

            <div></div>

            <div className="h-11 w-full rounded-md bg-brand-200"></div>
        </motion.div>
    );
}

function Header() {
    return (
        <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <div className="size-8 rounded-full bg-brand-200"></div>

                <div className="h-8 w-40 rounded-md bg-brand-200"></div>
            </div>

            <div className="flex gap-x-2">
                <div className="size-8 rounded-full bg-brand-200"></div>
                <div className="size-8 rounded-full bg-brand-200"></div>
            </div>
        </div>
    );
}

function OpenCard() {
    return (
        <div className="space-y-4 rounded-md bg-brand-200 px-4 py-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <div className="size-9 rounded-full bg-brand-300"></div>
                    <div className="h-8 w-48 rounded-md bg-brand-300"></div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="h-8 w-16 rounded-md bg-brand-300"></div>
                    <div className="size-8 rounded-full bg-brand-300"></div>
                </div>
            </div>

            <div className="h-8 w-28 rounded-md bg-brand-300 py-3"></div>

            <div className="flex justify-between">
                <div className="flex gap-x-2">
                    <div className="size-5 rounded-md bg-brand-300"></div>
                    <div>
                        <div className="h-10 w-16 rounded-md bg-brand-300"></div>
                        <div className="mx-auto mt-1 h-3 w-8 rounded-md bg-brand-300"></div>
                    </div>

                    <div>
                        <div className="h-10 w-16 rounded-md bg-brand-300"></div>
                        <div className="mx-auto mt-1 h-3 w-8 rounded-md bg-brand-300"></div>
                    </div>

                    <div>
                        <div className="h-10 w-16 rounded-md bg-brand-300"></div>
                        <div className="mx-auto mt-1 h-3 w-8 rounded-md bg-brand-300"></div>
                    </div>
                </div>

                <div className="mt-2 flex gap-x-2">
                    <div className="h-8 w-24 rounded-md bg-brand-300"></div>
                    <div className="size-8 rounded-full bg-brand-300"></div>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-x-2">
                <div className="col-span-4 h-11 w-full rounded-md bg-brand-300"></div>
                <div className="col-span-1 h-11 w-full rounded-md bg-brand-300"></div>
            </div>
        </div>
    );
}

function CloseCard() {
    return (
        <div className="space-y-4 rounded-md bg-brand-200 px-4 py-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <div className="size-9 rounded-full bg-brand-300"></div>
                    <div className="h-8 w-48 rounded-md bg-brand-300"></div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="h-8 w-16 rounded-md bg-brand-300"></div>
                    <div className="size-8 rounded-full bg-brand-300"></div>
                </div>
            </div>
        </div>
    );
}
