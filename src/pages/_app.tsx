import type { AppProps } from 'next/app';
import { api } from '~/utils/api';
import { NProgress } from '~/components/NProgress';
import { UserProvider } from '~/contexts/useUser';
import { ExercisesProvider } from '~/contexts/useExercises';
import { Toaster } from 'react-hot-toast';
import '~/styles/globals.css';
import { Layout } from '~/components/Layout';

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <NProgress />
            <Toaster
                position="bottom-center"
                toastOptions={{
                    style: { padding: '1rem 1.5rem' },
                }}
            />

            {pageProps.viewer ? (
                <UserProvider viewer={pageProps.viewer}>
                    <ExercisesProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ExercisesProvider>
                </UserProvider>
            ) : (
                <Component {...pageProps} />
            )}
        </>
    );
}

export default api.withTRPC(App);
