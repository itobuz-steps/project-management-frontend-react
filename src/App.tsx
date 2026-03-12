import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { Flip, ToastContainer } from 'react-toastify';
import './App.scss';
import { MainRouter } from './components/routers/MainRouter';
import { getAntdTheme } from './config/antdTheme';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { useTheme } from './hooks/useTheme';

function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useTheme();

  return (
    <ConfigProvider theme={getAntdTheme(theme)}>{children}</ConfigProvider>
  );
}

const queryClient = new QueryClient();
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
        limit={3}
      />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AntdThemeProvider>
            <AuthProvider>
              <MainRouter />
            </AuthProvider>
          </AntdThemeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
