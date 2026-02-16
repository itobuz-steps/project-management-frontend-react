import { Flip, ToastContainer } from 'react-toastify';
import { MainRouter } from './components/routers/MainRouter';
import { useTheme } from './hooks/useTheme';
import { useEffect } from 'react';
import './App.scss';

function App() {
  const [, setTheme] = useTheme();
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'indigo';
    setTheme(theme);
  }, [setTheme]);
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
      <MainRouter />
    </>
  );
}

export default App;
