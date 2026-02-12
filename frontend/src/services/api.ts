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
  } else {
    console.warn(`No token available for ${method} ${endpoint}`);
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (response.status === 401) {
      // Token expired or invalid - clear it
      localStorage.removeItem("token");
      window.location.href = "/";
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || errorData.msg || `API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

// Auth response type
interface AuthResponse {
  token: string;
  name: string;
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
// Recurring Expense APIs (disabled)
/*
export const recurringExpenseAPI = {
  add: (amount: number, category: string, frequency: string, startDate: string, description?: string): Promise<any> =>
    apiCall("/recurring-expenses", "POST", { amount, category, frequency, startDate, description }),
  getAll: (): Promise<any[]> => apiCall("/recurring-expenses", "GET"),
  update: (id: string, amount: number, category: string, frequency: string, startDate: string, description?: string, isActive?: boolean): Promise<any> =>
    apiCall(`/recurring-expenses/${id}`, "PUT", { amount, category, frequency, startDate, description, isActive }),
  delete: (id: string): Promise<any> => apiCall(`/recurring-expenses/${id}`, "DELETE"),
};
*/
