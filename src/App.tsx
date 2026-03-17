import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { Flip, ToastContainer } from 'react-toastify';
import './App.scss';
import { MainRouter } from './components/routers/MainRouter';
import { getAntdTheme } from './config/antdTheme';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { useColorMode } from './hooks/useColorMode';
import { useTheme } from './hooks/useTheme';

function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useTheme();
  const [colorMode] = useColorMode();

  return (
    <ConfigProvider theme={getAntdTheme(theme, colorMode)}>
      {children}
    </ConfigProvider>
  );
}

function AppToastContainer() {
  const [colorMode] = useColorMode();

  return (
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
      theme={colorMode}
      transition={Flip}
      limit={3}
    />
  );
}

const queryClient = new QueryClient();

// For react query devtools
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppToastContainer />
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
