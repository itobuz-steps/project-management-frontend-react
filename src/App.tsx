import { Flip, ToastContainer } from 'react-toastify';
import { MainRouter } from './components/routers/MainRouter';
import './App.scss';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';

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
        <AuthProvider>
          <MainRouter />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
