import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';

function App() {
  const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}

        {isAuthenticated && (
          <Route
            path="/*"
            element={
              <MainLayout>
                <Dashboard />;
                <h1 className="text-2xl font-semibold">Hello world</h1>
              </MainLayout>
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
