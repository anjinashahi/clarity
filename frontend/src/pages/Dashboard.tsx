import { Bar, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "../components/Sidebar";
import { useExpense } from "../hooks/useFinance";
import { useIncome } from "../hooks/useFinance";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { expenses, fetchExpenses, error: expenseError } = useExpense();
  const { incomes, fetchIncomes, error: incomeError } = useIncome();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found - redirecting to login");
      window.location.href = "/";
      return;
    }
    fetchExpenses();
    fetchIncomes();
  }, [fetchExpenses, fetchIncomes]);

  useEffect(() => {
    const incomeSum = incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
    const expenseSum = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    setTotalIncome(incomeSum);
    setTotalExpenses(expenseSum);
  }, [incomes, expenses]);

  // Group expenses and incomes by month
  const monthlyData: { [key: string]: { expenses: number; income: number } } = {
    Jan: { expenses: 0, income: 0 },
    Feb: { expenses: 0, income: 0 },
    Mar: { expenses: 0, income: 0 },
    Apr: { expenses: 0, income: 0 },
    May: { expenses: 0, income: 0 },
    Jun: { expenses: 0, income: 0 },
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthNames: { [key: number]: string } = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
  };

  expenses.forEach((expense: any) => {
    const month = monthNames[new Date(expense.date).getMonth()];
    if (month && monthlyData[month]) {
      monthlyData[month].expenses += expense.amount;
    }
  });

  incomes.forEach((income: any) => {
    const month = monthNames[new Date(income.date).getMonth()];
    if (month && monthlyData[month]) {
      monthlyData[month].income += income.amount;
    }
  });

  const expenseData = months.map((month) => monthlyData[month].expenses);
  const incomeData = months.map((month) => monthlyData[month].income);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <h1>Dashboard</h1>
        <div className="summary-cards">
          <div className="card income-card">
            <h3>Income</h3>
            <p>Rs {totalIncome}</p>
          </div>
          <div className="card expense-card">
            <h3>Expenses</h3>
            <p>Rs {totalExpenses}</p>
          </div>
        </div>

        <div className="charts">
          <div className="chart-card">
            <h3>Expenses Overview</h3>
            <Bar
              data={{
                labels: months,
                datasets: [
                  { label: "Expenses", data: expenseData, backgroundColor: "#ef4444" },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>

          <div className="chart-card">
            <h3>Income & Expenses Trend</h3>
            <Line
              data={{
                labels: months,
                datasets: [
                  { label: "Income", data: incomeData, borderColor: "#22c55e", backgroundColor: "#22c55e33", tension: 0.3 },
                  { label: "Expenses", data: expenseData, borderColor: "#ef4444", backgroundColor: "#ef444433", tension: 0.3 },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
