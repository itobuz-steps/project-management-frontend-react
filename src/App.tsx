import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

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
