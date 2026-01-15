import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/common/Layout';
import Login from './pages/Login';
import TripList from './components/trips/TripList';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CurrencyProvider>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                  <Route path="/" element={<Navigate to="/trips" replace />} />
                  <Route path="/trips" element={<TripList />} />
                  <Route path="/create-trip" element={<CreateTrip />} />
                  <Route path="/trips/:tripId" element={<TripDetails />} />
                  <Route path="/trips/:tripId/add-expense" element={<AddExpense />} />
                  <Route path="/trips/:tripId/expenses/:expenseId/edit" element={<EditExpense />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </CurrencyProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
