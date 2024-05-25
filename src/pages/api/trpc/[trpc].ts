import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '~/trpc/root';
import { createTRPCContext } from '~/trpc/trpc';

export default createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext
});
