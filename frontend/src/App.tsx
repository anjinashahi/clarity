// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ExpenseProvider } from "./context/ExpenseContext";
import { IncomeProvider } from "./context/IncomeContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AddIncome from "./pages/addIncome";
import AddExpense from "./pages/addExpense";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <ExpenseProvider>
          <IncomeProvider>
            <Routes>
              <Route path="/" element={<Auth />} />          
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-income"
                element={
                  <ProtectedRoute>
                    <AddIncome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-expense"
                element={
                  <ProtectedRoute>
                    <AddExpense />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </IncomeProvider>
        </ExpenseProvider>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
