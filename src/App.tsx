import { Flip, ToastContainer } from 'react-toastify';
import { MainRouter } from './components/routers/MainRouter';
import './App.scss';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { ConfigProvider } from 'antd';
import { useTheme } from './hooks/useTheme';
import { getAntdTheme } from './config/antdTheme';

function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useTheme();

  return (
    <ConfigProvider theme={getAntdTheme(theme)}>{children}</ConfigProvider>
  );
}

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
      <ThemeProvider>
        <AntdThemeProvider>
          <AuthProvider>
            <MainRouter />
          </AuthProvider>
        </AntdThemeProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
