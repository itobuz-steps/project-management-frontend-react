import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {isAuthenticated && (
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
                {/* <h1 className="text-2xl font-semibold">Hello world</h1> */}
              </MainLayout>
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
