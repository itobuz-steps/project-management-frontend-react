import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';
import Dashboard from '../../pages/Dashboard';
import { ForgotPasswordPage } from '../../pages/ForgotPasswordPage';
import { SignupPage } from '../../pages/SignupPage';
import { LoginPage } from '../../pages/LoginPage';
import { VerifyOtpPage } from '../../pages/VerifyOtpPage';
import { EditProfilePage } from '../../pages/EditProfilePage';
import { ProjectProvider } from '../../context/ProjectProvider';
import { AcceptInvitePage } from '../../pages/AcceptInvitePage';
import TaskPage from '../../pages/TaskPage';
import BacklogView from '../views/BacklogView/BacklogView';
import BoardView from '../views/BoardView/BoardView';
import ListView from '../views/ListView/ListView';
import { ForYouPage } from '../../pages/ForYouPage';
import { ProtectedRoute } from '../common/ProtectedRoute';
import { AuthRedirect } from '../../utils/AuthRedirect';
import ProjectSettings from '../../pages/ProjectSettings';

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/signup"
          element={
            <AuthRedirect>
              <SignupPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRedirect>
              <ForgotPasswordPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <AuthRedirect>
              <VerifyOtpPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/invite/join"
          element={
            <AuthRedirect>
              <AcceptInvitePage />
            </AuthRedirect>
          }
        />
        {/* Protected routes */}
        <Route element={<ProtectedRoute redirectPath="/login" />}>
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route
            element={
              <ProjectProvider>
                <MainLayout />
              </ProjectProvider>
            }
          >
            {/* Dashboard routes */}
            <Route path="/for-you" element={<ForYouPage />} />
            <Route path="/" element={<Navigate to="/for-you" replace />} />
            <Route path="/project/:projectId" element={<Dashboard />}>
              <Route index element={<Navigate to="backlog" replace />} />
              <Route path="settings" element={<ProjectSettings />} />
              <Route path="backlog" element={<BacklogView />} />
              <Route path="board" element={<BoardView />} />
              <Route path="list" element={<ListView />} />
            </Route>
            {/* Task detail page */}
            <Route path="/task/:taskId" element={<TaskPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
