export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  currentStock: number;
  minStock: number;
  location: string;
  supplier: string;
  createdAt: Date;
  image?: {
    url: string;
    fileName: string;
  };
  description?: string;
  price?: number;
  barcode?: string;
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

// User Roles
export type UserRole = 'ADMIN' | 'STAFF' | 'VIEWER';

// Permission Types
export interface Permission {
  dashboard: boolean;
  products: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  transactions: {
    view: boolean;
    create: boolean;
    edit: boolean;
  };
  inventory: {
    view: boolean;
    update: boolean;
  };
  reports: {
    view: boolean;
    export: boolean;
  };
  userManagement: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

// Role-based Permissions
export const RolePermissions: Record<UserRole, Permission> = {
  ADMIN: {
    dashboard: true,
    products: { view: true, create: true, edit: true, delete: true },
    transactions: { view: true, create: true, edit: true },
    inventory: { view: true, update: true },
    reports: { view: true, export: true },
    userManagement: { view: true, create: true, edit: true, delete: true }
  },
  STAFF: {
    dashboard: true,
    products: { view: true, create: true, edit: true, delete: false },
    transactions: { view: true, create: true, edit: false },
    inventory: { view: true, update: false },
    reports: { view: true, export: false },
    userManagement: { view: false, create: false, edit: false, delete: false }
  },
  VIEWER: {
    dashboard: true,
    products: { view: true, create: false, edit: false, delete: false },
    transactions: { view: true, create: false, edit: false },
    inventory: { view: true, update: false },
    reports: { view: true, export: false },
    userManagement: { view: false, create: false, edit: false, delete: false }
  }
};

// User Interface
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  lastLogin?: Date;
  isActive: boolean;
}

export interface DashboardStats {
  totalProducts: number;
  todayIn: number;
  todayOut: number;
  lowStockProducts: number;
}

// Warehouse Type
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  manager?: {
    name: string;
    contactInfo: string;
  };
  products: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  status: 'ACTIVE' | 'MAINTENANCE' | 'FULL';
  lastInventoryDate?: Date;
}

// Warehouse Report Type
export interface WarehouseReport {
  warehouseId: string;
  date: Date;
  totalProducts: number;
  uniqueProductTypes: number;
  mostStoredProduct: {
    productId: string;
    productName: string;
    quantity: number;
  };
  occupancyRate: number;
  recentTransactions: InventoryTransaction[];
}

// Inventory Transaction Type
export type InventoryTransactionType = 'IN' | 'OUT' | 'TRANSFER';

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: InventoryTransactionType;
  quantity: number;
  sourceWarehouseId?: string;
  destinationWarehouseId?: string;
  supplier?: string;
  customer?: string;
  department?: string;
  date: Date;
  notes?: string;
}