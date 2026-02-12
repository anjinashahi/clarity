import { Bar, Line, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
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
  ArcElement,
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

  // Group expenses by category
  const expensesByCategory: { [key: string]: number } = {};
  expenses.forEach((expense: any) => {
    const category = expense.category || "Uncategorized";
    expensesByCategory[category] = (expensesByCategory[category] || 0) + expense.amount;
  });

  const categoryLabels = Object.keys(expensesByCategory);
  const categoryValues = Object.values(expensesByCategory);

  // Color palette for pie chart
  const categoryColors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#0ea5e9", // sky
    "#6366f1", // indigo
    "#a855f7", // purple
    "#ec4899", // pink
  ];

  const pieChartColors = categoryColors.slice(0, categoryLabels.length);

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

          <div className="chart-card pie-chart-card">
            <h3>Expenses by Category</h3>
            {categoryLabels.length > 0 ? (
              <Pie
                data={{
                  labels: categoryLabels,
                  datasets: [
                    {
                      data: categoryValues,
                      backgroundColor: pieChartColors,
                      borderColor: "#ffffff",
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            ) : (
              <p style={{ textAlign: "center", color: "#999" }}>No expense data available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
