import { useCallback } from 'react';
import { api } from './api';
import { useRouter } from 'next/router';

export function useAuthRedirect() {
    const queryClientUtils = api.useUtils();
    const router = useRouter();

    return useCallback(() => {
        queryClientUtils.invalidate();
        router.push((router.query.redirect as string) ?? '/');
    }, [queryClientUtils, router]);
}
