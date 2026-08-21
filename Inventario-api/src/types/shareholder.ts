export interface Shareholder {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  sharePercentage: number | any;
  investmentAmount: number | any;
  joinedAt: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateShareholderDTO {
  name: string;
  email?: string;
  phone?: string;
  sharePercentage: number;
  investmentAmount: number;
}

export interface UpdateShareholderDTO {
  name?: string;
  email?: string;
  phone?: string;
  sharePercentage?: number;
  investmentAmount?: number;
  isActive?: boolean;
}