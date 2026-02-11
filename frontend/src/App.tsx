// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ExpenseProvider } from "./context/ExpenseContext";
import { IncomeProvider } from "./context/IncomeContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AddIncome from "./pages/addIncome";
import AddExpense from "./pages/addExpense";
import History from "./pages/History";

function App() {
  return (
    <Router>
      <ExpenseProvider>
        <IncomeProvider>
          <Routes>
            <Route path="/" element={<Auth />} />          
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-income" element = {<AddIncome />} />
            <Route path="/add-expense" element = {<AddExpense />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </IncomeProvider>
      </ExpenseProvider>
    </Router>
  );
}

export default App;
