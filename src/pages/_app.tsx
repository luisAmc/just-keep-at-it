import type { AppProps } from 'next/app';
import { api } from '~/utils/api';
import { NProgress } from '~/components/NProgress';
import { UserProvider } from '~/contexts/useUser';
import { ExercisesProvider } from '~/contexts/useExercises';
import { Layout } from '~/components/Layout';
import { ThemeProvider } from '~/contexts/useTheme';
import '~/styles/globals.css';
import { Toaster } from 'sonner';

function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
            <NProgress />
            <Toaster richColors />

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
