export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  currentStock: number;
  minStock: number;
  location: string;
  supplier?: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  date: Date;
  supplier?: string;
  customer?: string;
  destination?: string;
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface DashboardStats {
  totalProducts: number;
  todayIn: number;
  todayOut: number;
  lowStockProducts: number;
}