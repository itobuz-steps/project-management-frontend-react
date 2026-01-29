import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { Flip, ToastContainer } from 'react-toastify';
import { EditProfilePage } from './pages/EditProfilePage';
import { ProjectProvider } from './context/ProjectProvider';
import { AcceptInvitePage } from './pages/AcceptInvitePage';
import TaskPage from './pages/TaskPage';

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
          {/* PUBLIC */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/invite/join" element={<AcceptInvitePage />} />

          {/* APP */}
          {isAuthenticated && (
            <Route
              element={
                <ProjectProvider>
                  <MainLayout />
                </ProjectProvider>
              }
            >
              {/* Dashboard */}
              <Route
                path="/dashboard"
                element={<Navigate to="/dashboard/default" replace />}
              />
              <Route path="/dashboard/:projectId" element={<Dashboard />} />
              <Route
                path="/dashboard/:projectId/:taskId"
                element={<Dashboard />}
              />

              {/* ✅ FULL PAGE TASK */}
              <Route
                path="/projects/:projectId/tasks/:taskId"
                element={<TaskPage />}
              />

              <Route path="/edit-profile" element={<EditProfilePage />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
