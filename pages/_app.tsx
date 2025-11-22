// _app.tsx (updated with AuthProvider + conditional Layout)
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Routes that should NOT use dashboard layout
  const noLayoutRoutes = ["/", "/login", "/register"];
  const useLayout = !noLayoutRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      {useLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}
