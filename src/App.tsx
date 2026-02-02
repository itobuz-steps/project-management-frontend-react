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
import BacklogView from './components/views/BacklogView/BacklogView';
import BoardView from './components/views/BoardView/BoardView';
import ListView from './components/views/ListView/ListView';
import TaskPage from './pages/TaskPage';
import { ForYouPage } from './pages/ForYouPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

function App() {
  const isAuthenticated = localStorage.getItem('access_token') !== null;
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
          {/* Redirect root */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? '/dashboard' : '/login'}
                replace
              />
            }
          />

          {/* PUBLIC ROUTES */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/invite/join" element={<AcceptInvitePage />} />

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute redirectPath="/login" />}>
            <Route
              element={
                <ProjectProvider>
                  <MainLayout />
                </ProjectProvider>
              }
            >
              {/* Dashboard redirects */}
              <Route
                path="/dashboard"
                element={<Navigate to="/dashboard/default" replace />}
              />
              <Route path="/dashboard/:projectId" element={<Dashboard />} />
              <Route
                path="/dashboard/:projectId?/:taskId?"
                element={<Dashboard />}
              >
                <Route index element={<Navigate to="backlog" replace />} />
                <Route path="backlog" element={<BacklogView />} />
                <Route path="board" element={<BoardView />} />
                <Route path="list" element={<ListView />} />
                <Route path="for-you" element={<ForYouPage />} />
              </Route>

              {/* Full page task */}
              <Route
                path="/projects/:projectId/tasks/:taskId"
                element={<TaskPage />}
              />

              {/* Edit profile */}
              <Route path="/edit-profile" element={<EditProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
