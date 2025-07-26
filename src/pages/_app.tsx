import type { AppProps } from 'next/app';
import { api } from '~/utils/api';
import { NProgress } from '~/components/NProgress';
import { UserProvider } from '~/contexts/useUser';
import { ExercisesProvider } from '~/contexts/useExercises';
import { Toaster } from 'react-hot-toast';
import { Layout } from '~/components/Layout';
import { ThemeProvider } from '~/contexts/useTheme';
import '~/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
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
        </ThemeProvider>
    );
}

export default api.withTRPC(App);
