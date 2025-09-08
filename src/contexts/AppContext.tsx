import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, Transaction, User, DashboardStats } from '../types';

interface AppState {
  user: User | null;
  products: Product[];
  transactions: Transaction[];
  currentPage: string;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_PAGE'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'LOAD_INITIAL_DATA' };

const initialState: AppState = {
  user: null,
  products: [],
  transactions: [],
  currentPage: 'login'
};

// Sample data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'لپ تاپ ایسوس',
    code: 'LAP001',
    category: 'الکترونیک',
    currentStock: 15,
    minStock: 5,
    location: 'انبار A-1',
    supplier: 'شرکت تک‌نولوژی',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'موس بی‌سیم',
    code: 'MOU001',
    category: 'الکترونیک',
    currentStock: 3,
    minStock: 10,
    location: 'انبار A-2',
    supplier: 'پخش رایانه',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'صندلی اداری',
    code: 'CHR001',
    category: 'اداری',
    currentStock: 25,
    minStock: 8,
    location: 'انبار B-1',
    supplier: 'مبل سازان',
    createdAt: new Date('2024-02-01')
  }
];

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    productId: '1',
    productName: 'لپ تاپ ایسوس',
    type: 'in',
    quantity: 10,
    date: new Date(),
    supplier: 'شرکت تک‌نولوژی',
    notes: 'خرید جدید'
  },
  {
    id: '2',
    productId: '2',
    productName: 'موس بی‌سیم',
    type: 'out',
    quantity: 5,
    date: new Date(),
    customer: 'دپارتمان IT',
    notes: 'تحویل به واحد IT'
  }
];

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, currentPage: 'dashboard' };
    case 'LOGOUT':
      return { ...state, user: null, currentPage: 'login' };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        )
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    case 'ADD_TRANSACTION':
      const newTransaction = action.payload;
      const updatedProducts = state.products.map(product => {
        if (product.id === newTransaction.productId) {
          const newStock = newTransaction.type === 'in'
            ? product.currentStock + newTransaction.quantity
            : product.currentStock - newTransaction.quantity;
          return { ...product, currentStock: Math.max(0, newStock) };
        }
        return product;
      });
      
      return {
        ...state,
        products: updatedProducts,
        transactions: [newTransaction, ...state.transactions]
      };
    case 'LOAD_INITIAL_DATA':
      return {
        ...state,
        products: sampleProducts,
        transactions: sampleTransactions
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getDashboardStats: () => DashboardStats;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const getDashboardStats = (): DashboardStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = state.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      transactionDate.setHours(0, 0, 0, 0);
      return transactionDate.getTime() === today.getTime();
    });

    const todayIn = todayTransactions
      .filter(t => t.type === 'in')
      .reduce((sum, t) => sum + t.quantity, 0);

    const todayOut = todayTransactions
      .filter(t => t.type === 'out')
      .reduce((sum, t) => sum + t.quantity, 0);

    const lowStockProducts = state.products.filter(p => p.currentStock <= p.minStock).length;

    return {
      totalProducts: state.products.length,
      todayIn,
      todayOut,
      lowStockProducts
    };
  };

  return (
    <AppContext.Provider value={{ state, dispatch, getDashboardStats }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}