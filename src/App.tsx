import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import EmployeesDashboard from './pages/EmployeesDashboards';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/employee-dashboard/*" element={<EmployeesDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;