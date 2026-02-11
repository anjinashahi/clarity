const API_BASE_URL = "http://localhost:5000/api";

// Get token from localStorage
const getToken = (): string | null => localStorage.getItem("token");

// Helper function for API calls
const apiCall = async <T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: any
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
};

// Auth response type
interface AuthResponse {
  token: string;
}

// Auth APIs
export const authAPI = {
  register: (name: string, email: string, password: string): Promise<AuthResponse> =>
    apiCall<AuthResponse>("/auth/register", "POST", { name, email, password }),
  login: (email: string, password: string): Promise<AuthResponse> =>
    apiCall<AuthResponse>("/auth/login", "POST", { email, password }),
};

// Expense APIs
export const expenseAPI = {
  add: (amount: number, category: string, date: string, description?: string): Promise<any> =>
    apiCall("/expenses", "POST", { amount, category, date, description }),
  getAll: (): Promise<any[]> => apiCall("/expenses", "GET"),
  update: (id: string, amount: number, category: string, date: string, description?: string): Promise<any> =>
    apiCall(`/expenses/${id}`, "PUT", { amount, category, date, description }),
  delete: (id: string): Promise<any> => apiCall(`/expenses/${id}`, "DELETE"),
};

// Income APIs
export const incomeAPI = {
  add: (amount: number, category: string, date: string, description?: string): Promise<any> =>
    apiCall("/incomes", "POST", { amount, category, date, description }),
  getAll: (): Promise<any[]> => apiCall("/incomes", "GET"),
  update: (id: string, amount: number, category: string, date: string, description?: string): Promise<any> =>
    apiCall(`/incomes/${id}`, "PUT", { amount, category, date, description }),
  delete: (id: string): Promise<any> => apiCall(`/incomes/${id}`, "DELETE"),
};
