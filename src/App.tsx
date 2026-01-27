import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { Flip, ToastContainer } from 'react-toastify';
import { EditProfilePage } from './pages/EditProfilePage';
import { ProjectProvider } from './context/ProjectProvider';

function App() {
  const isAuthenticated = true;

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
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />

          {isAuthenticated && (
            <>
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route
                path="/dashboard"
                element={
                  <ProjectProvider>
                    <MainLayout>
                      <Dashboard />
                      {/* <h1 className="text-2xl font-semibold">Hello world</h1> */}
                    </MainLayout>
                  </ProjectProvider>
                }
              />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
