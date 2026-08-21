// ============================
// ENUMS
// ============================

export type Role = 'ADMIN' | 'MANAGER' | 'SALES' | 'WAREHOUSE';

export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';

export type PurchaseStatus = 'PENDING' | 'RECEIVED' | 'CANCELLED';

export type SaleStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

// ============================
// MODELOS PRINCIPALES
// ============================

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  taxId?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Shareholder {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  sharePercentage: number; // Decimal se maneja como number en frontend
  investmentAmount: number;
  joinedAt: string | Date;
  isActive: boolean;
  createdAt: string | Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string | Date;
}

export interface Warehouse {
  id: string;
  name: string;
  location?: string | null;
  createdAt: string | Date;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  unitPrice: number;
  costPrice: number;
  categoryId: string;
  supplierId: string;
  minStock: number;
  maxStock?: number | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  category?: Category;
  supplier?: Supplier;
}

export interface Stock {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  updatedAt: string | Date;
  product?: Product;
  warehouse?: Warehouse;
}

export interface StockMovement {
  id: string;
  productId: string;
  warehouseId: string;
  userId: string;
  type: MovementType;
  quantity: number;
  reason?: string | null;
  referenceId?: string | null;
  createdAt: string | Date;
  product?: Product;
  warehouse?: Warehouse;
  user?: User;
}

export interface Purchase {
  id: string;
  supplierId: string;
  userId: string;
  status: PurchaseStatus;
  totalAmount: number;
  createdAt: string | Date;
  receivedAt?: string | Date | null;
  supplier?: Supplier;
  user?: User;
  items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
  product?: Product;
}

export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string | Date;
}

export interface Sale {
  id: string;
  customerId?: string | null;
  userId: string;
  status: SaleStatus;
  totalAmount: number;
  createdAt: string | Date;
  customer?: Customer | null;
  user?: User;
  items?: SaleItem[];
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product?: Product;
}

export interface ProductAnalytics {
  id: string;
  productId: string;
  currentStock: number;
  avgMonthlySales: number;
  daysWithoutMovement: number;
  lastSaleAt?: string | Date | null;
  lastPurchaseAt?: string | Date | null;
  reorderPoint: number;
  suggestedReorderQty: number;
  isSlowMoving: boolean;
  needsReorder: boolean;
  computedAt: string | Date;
}

// ============================
// TIPOS DE AUTENTICACIÓN Y API
// ============================

export interface AuthResponse {
  token?: string;
  user: User;
  message?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}