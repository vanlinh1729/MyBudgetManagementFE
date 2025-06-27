// Auth Models
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  roles: string[];
}

// Category Models
export interface Category {
  id: string;
  name: string;
  icon: string;
  budget?: number;
  type: CategoryType;
  period: Period;
  isDefault: boolean;
  level: CategoryLevel;
}

export interface CreateCategoryCommand {
  name: string;
  icon: string;
  budget?: number;
  type: CategoryType;
  period: Period;
  isDefault: boolean;
  level: CategoryLevel;
}

export interface UpdateCategoryCommand {
  id: string;
  name: string;
  budget?: number;
  icon: string;
  level: CategoryLevel;
  period: Period;
}

export enum CategoryType {
  Income = 0,
  Expense = 1,
  Transfer = 2
}

export enum CategoryLevel {
  Parent = 0,
  Child = 1
}

export enum Period {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3
}

// Transaction Models
export interface Transaction {
  id: string;
  categoryId: string;
  debtAndLoanId?: string;
  amount: number;
  date: string;
  note?: string;
  image?: string;
  category: Category;
}

export interface CreateTransactionCommand {
  categoryId: string;
  debtAndLoanId?: string;
  amount: number;
  date: string;
  note?: string;
  image?: string;
}

export interface UpdateTransactionCommand {
  id: string;
  amount: number;
  date: string;
  note?: string;
  image?: string;
  categoryId: string;
}

// Debt and Loan Models
export interface DebtAndLoan {
  id: string;
  debtContactId: string;
  categoryId: string;
  isDebt: boolean;
  amount: number;
  image?: string;
  startDate: string;
  paymentDate: string;
  note?: string;
  category: Category;
  remainingAmount: number;
  paidAmount: number;
}

export interface CreateDebtAndLoanCommand {
  debtContactId: string;
  categoryId: string;
  isDebt: boolean;
  amount: number;
  image?: string;
  startDate: string;
  paymentDate: string;
  note?: string;
}

export interface UpdateDebtAndLoanCommand {
  id: string;
  debtContactId: string;
  categoryId: string;
  isDebt: boolean;
  amount: number;
  startDate: string;
  paymentDate: string;
  note?: string;
  image?: string;
}

export interface PayDebtAndLoanCommand {
  debtAndLoanId: string;
  amount: number;
  note?: string;
  image?: string;
  date?: string;
}

export interface Payment {
  id: string;
  debtAndLoanId: string;
  amount: number;
  date: string;
  note?: string;
  image?: string;
}

// Dashboard Models
export interface DashboardOverview {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  budgetUsage: number;
  recentTransactions: Transaction[];
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  budgetAmount?: number;
  percentage: number;
}

export interface DebtLoanOverview {
  totalDebt: number;
  totalLoan: number;
  overdueDebts: number;
  overdueLoans: number;
}

// User Profile Models
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  gender?: Gender;
  dateOfBirth?: string;
  phoneNumber?: string;
  currency: Currencies;
}

export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2
}

export enum Currencies {
  USD = 840,
  EUR = 978,
  JPY = 392,
  GBP = 826,
  AUD = 36,
  CAD = 124,
  CHF = 756,
  CNY = 156,
  HKD = 344,
  NZD = 554,
  VND = 704
}

// Enhanced Dashboard Models
export interface DashboardOverview {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  budgetUsage: number;
  recentTransactions: Transaction[];
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  budgetAmount?: number;
  percentage: number;
}

// Search Results
export interface SearchResult {
  type: 'transaction' | 'category' | 'debt';
  id: string;
  title: string;
  subtitle?: string;
  amount?: number;
}

// Common Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterParams {
  year?: number;
  month?: number;
  categoryId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} 