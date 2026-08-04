export interface Dividend {
  id: string;
  shareholderId: string;
  productId: string | null;
  amount: number | any;
  period: string;
  paidAt: Date;
  notes: string | null;
  createdAt: Date;
}

export interface CreateDividendDTO {
  shareholderId: string;
  productId?: string;
  amount: number;
  period: string;
  notes?: string;
}

export interface UpdateDividendDTO {
  amount?: number;
  period?: string;
  notes?: string;
}