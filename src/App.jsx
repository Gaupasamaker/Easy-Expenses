import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/common/Layout';
import Login from './pages/Login';
import TripList from './components/trips/TripList';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import AddExpense from './pages/AddExpense';

// Placeholder pages
const Dashboard = () => <div><h2 className="text-2xl font-bold mb-4">Dashboard</h2><p>Welcome to EasyExpenses!</p></div>;
const Settings = () => <div><h2 className="text-2xl font-bold mb-4">Settings</h2></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trips" element={<TripList />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/trips/:tripId" element={<TripDetails />} />
            <Route path="/trips/:tripId/add-expense" element={<AddExpense />} />
            <Route path="/settings" element={<Settings />} />
            {/* Redirect root to trips for now until dashboard is ready or default */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
