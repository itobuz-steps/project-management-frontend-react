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
import BacklogView from './components/views/BacklogView';
import BoardView from './components/views/BoardView';
import ListView from './components/views/ListView';
import { ForYouPage } from './pages/ForYouPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

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
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/invite/join" element={<AcceptInvitePage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route
              path="/dashboard"
              element={<Navigate to="/dashboard/default" replace />}
            />
            <Route
              path="/dashboard/:projectId?/:taskId?"
              element={
                <ProjectProvider>
                  <MainLayout>
                    <Dashboard />
                    {/* <h1 className="text-2xl font-semibold">Hello world</h1> */}
                  </MainLayout>
                </ProjectProvider>
              }
            >
              <Route index element={<Navigate to="backlog" replace />} />
              <Route path="backlog" element={<BacklogView />} />
              <Route path="board" element={<BoardView />} />
              <Route path="list" element={<ListView />} />
              <Route path="for-you" element={<ForYouPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
