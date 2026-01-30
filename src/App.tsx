import { Flip, ToastContainer } from 'react-toastify';
import { MainRouter } from './components/routers/MainRouter';

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
      <MainRouter />
    </>
  );
}

export default App;
